<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { CharactersService, type ReviewRead, type RideRead } from "@/lib/client";
  import { emotion } from "@/lib/stores";

  import Button from "@/components/Button.svelte";
  import Modal from "@/components/Modal.svelte";

  export let data: RideRead;
  export let currentRide: RideRead;
  export let resolution = false;

  const dispatch = createEventDispatcher();

  let correctAnswerList: RideRead;
  let solution: ReviewRead[];
  let visibleSolution: Array<string> = [];

  let score = 0;

  //shuffle array based on modern Fisher Yates shuffle - def figured it out by myself
  const shuffleSolutions = async ([...optionArray]) => {
    let n = optionArray.length;
    while (n) {
      const j = Math.floor(Math.random() * n--);
      [optionArray[n], optionArray[j]] = [optionArray[j], optionArray[n]];
    }
    return optionArray;
  };

  const getSolution = async (score: number) => {
    await CharactersService.getReviews(null, currentRide.id)
      .then((res) => (solution = res))
      .catch((err) => console.log(err));

    for (const [iterate] of Object.entries(solution)) {
      const setup = solution[iterate];
      if (score >= setup.linkedScore) {
        visibleSolution.push(setup.solution);
      }
    }
    //shuffle array to make visible solutions random
    visibleSolution = await shuffleSolutions(visibleSolution);

    return visibleSolution;
  };

  const giveScore = async (data: RideRead, correctReport: RideRead) => {
    let score = 0;

    for (const [property, value] of Object.entries(data)) {
      if (
        typeof correctReport[property] === "string" &&
        typeof value === "string" &&
        value.trim() !== ""
      ) {
        const correctAnswers = correctReport[property].split(";").map((s) => s.trim());
        const userAnswer = value.trim(); // Trim the user's input
        if (correctAnswers.includes(userAnswer)) {
          score = score + 2;
        }
      } else if (typeof correctReport[property] === "number") {
        if (correctReport[property] === value) {
          score = score + 0.5;
        }
      }
    }
    //base score on emotion level
    score = (score + $emotion / 50) / 2;
    return score;
  };

  const checkAnswer = async (data: RideRead, id: number) => {
    await CharactersService.getRideById(id)
      .then((res) => (correctAnswerList = res))
      .catch((err) => console.log(err));

    for (const [property] of Object.entries(data)) {
      property; // Type is string
      if (typeof correctAnswerList[property] === "number") {
        data[property] = Number(data[property]);
      }
    }
    score = await giveScore(data, correctAnswerList);

    return score;
  };

  const finishRide = async (solution: string) => {
    visibleSolution = [];
    score = 0;
    dispatch("finishRide", solution);
  };

  const getData = async () => {
    score = await checkAnswer(data, currentRide.id);
    visibleSolution = await getSolution(score);
  };

  $: if (resolution) {
    getData();
  }

  let ResolutionColors = [
    "bg-aurora-red",
    "bg-aurora-orange",
    "bg-aurora-yellow",
    "bg-aurora-green",
    "bg-aurora-purple",
  ];

  function randomnumber() {
    if (ResolutionColors.length > 0) {
      const index = Math.floor(Math.random() * ResolutionColors.length);
      const color = ResolutionColors[index];
      ResolutionColors.splice(index, 1);
      return color;
    } else {
      return "bg-frost-4";
    }
  }
</script>

<Modal modalHeader="Resolution" showModal={resolution}>
  <div class="flex w-full justify-center">
    <div class="flex flex-col overflow-y-auto overflow-x-hidden h-full pb-4">
      <p class="text-3xl text-frost-1 text-center">What should Paolo do?</p>
      {#await visibleSolution then solution}
        {#each solution as solution}
          <div class="flex flex-col mt-6">
            <Button
              onClick={() => finishRide(solution)}
              text={solution}
              class="{randomnumber()} !px-8" />
          </div>
        {/each}
      {/await}
    </div>
  </div>
</Modal>
