<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type { report } from "@/main";
  import { CharactersService, type ReviewRead, type RideRead } from "@/lib/client";

  import Button from "@/components/Button.svelte";
  import Modal from "@/components/Modal.svelte";

  export let data: report;
  export let current_ride: RideRead;
  export let resolution = false;

  const dispatch = createEventDispatcher();

  let correct_answer_list: RideRead;
  let solution: ReviewRead;
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
    // @ts-ignore type is not void
    solution = await CharactersService.getReviews(null, current_ride.id).catch((err) => console.log(err));

    for (const [iterate] of Object.entries(solution)) {
      const setup = solution[iterate];
      if (score >= setup.linked_score) {
        visibleSolution.push(setup.solution);
      }
    }
    //shuffle array to make visible solutions random
    visibleSolution = await shuffleSolutions(visibleSolution);

    return visibleSolution;
  };

  const giveScore = async (data: report, correctReport: report) => {
    for (const [property, value] of Object.entries(data)) {
      property; // Type is string
      value; // Type is any

      if (value === correctReport[property] && typeof data[property] === "number") {
        score = score + 1;
      } else if (value === correctReport[property] && typeof data[property] === "string") {
        score = score + 2;
      }
    }
    return score;
  };

  const checkAnswer = async (data: report, id: number) => {
    // @ts-ignore type is not void
    correct_answer_list = await CharactersService.getRideById(id).catch((err) => console.log(err));

    for (const [property] of Object.entries(data)) {
      property; // Type is string
      if (typeof correct_answer_list[property] === "number") {
        data[property] = Number(data[property]);
      }
    }
    score = await giveScore(data, correct_answer_list);

    return score;
  };

  const finishRide = async (solution: string) => {
    dispatch("finishRide", solution);
  };

  const getData = async () => {
    score = await checkAnswer(data, current_ride.id);
    visibleSolution = await getSolution(score);
  };

  $: if (resolution) {
    getData();
  }
</script>

<Modal modalHeader="Resolution" showModal={resolution}>
  <h2>What should Paolo do?</h2>
  {#await visibleSolution then solution}
    {#each solution as solution}
      <span on:keypress on:click={() => finishRide(solution)}>
        <Button text={solution} />
      </span>
    {/each}
  {/await}
</Modal>
