<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { CharactersService, type ReviewRead, type RideRead } from "@/lib/client";

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
    for (const [property, value] of Object.entries(data)) {
      property; // Type is string
      value; // Type is any

      if (typeof correctReport[property] === "string") {
        let workplease = correctReport[property];
        if (workplease.includes(value) && value >= 11) {
          score = score + 2;
          console.log(score);
        }
      }

      if (value === correctReport[property] && typeof data[property] === "number") {
        score = score + 1;
        console.log(score);
      }
    }
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
    dispatch("finishRide", solution);
  };

  const getData = async () => {
    score = await checkAnswer(data, currentRide.id);
    visibleSolution = await getSolution(score);
  };

  $: if (resolution) {
    getData();
  }
</script>

<Modal modalHeader="Resolution" showModal={resolution}>
  <div class="overflow-y-auto overflow-x-hidden h-full pb-4">
    <p class="text-3xl text-frost-1">What should Paolo do?</p>
    {#await visibleSolution then solution}
      {#each solution as solution}
        <div class="flex flex-col gap-1 w-screen mt-3">
          <Button onClick={() => finishRide(solution)} text={solution} class="bg-frost-4" />
        </div>
      {/each}
    {/await}
  </div>
</Modal>
