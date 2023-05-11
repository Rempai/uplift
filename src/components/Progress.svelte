<script lang="ts">
  import type { PassageRead } from "@/lib/client";
  import Modal from "./Modal.svelte";

  export let allPassages: Array<PassageRead>;
  export let passedPassages: Array<string> = [];

  let possibleBranches: Array<string> = [];
  let branchProgress: Record<string, number> = {};

  let progression = 0;
  let showModal = false;

  const branches = () => {
    allPassages.forEach((obj) => {
      if (!possibleBranches.find((e) => e === obj.branch) && !obj.branch.includes("Finish")) {
        possibleBranches.push(obj.branch);
      }
    });
  };

  const calcProgression = () => {
    possibleBranches.forEach((branch) => {
      const passagesWithBranch = allPassages.filter((obj) => obj.branch === branch);
      const totalBranchPassages = passagesWithBranch.length;

      if (totalBranchPassages > 0) {
        const seenBranchPassages = passedPassages.filter((passage) =>
          passagesWithBranch.some((obj) => obj.passage === passage)
        ).length;

        branchProgress[branch] = Math.round((seenBranchPassages / totalBranchPassages) * 100);
      } else {
        branchProgress[branch] = 0;
      }
    });

    const calculateAverage = (progress: Record<string, number>): number => {
      const branchValues = Object.values(progress);
      const sum = branchValues.reduce((acc, value) => acc + value, 0);
      const average = sum / branchValues.length;
      return Math.round(average);
    };

    progression = calculateAverage(branchProgress);
  };

  const popup = () => {
    showModal = !showModal;
  };

  let screenHeight: number = window.innerHeight;
  let screenWidth: number = window.innerWidth;

  window.addEventListener("resize", () => {
    screenHeight = window.innerHeight;
    screenWidth = window.innerWidth;
  });

  $: if (passedPassages && passedPassages.length > 0) {
    branches();
    calcProgression();
  }
</script>

<div>
  {#if allPassages && allPassages.length > 0}
    <div class="flex justify-center h-full cursor-pointer" on:click={popup} on:keypress>
      <div
        class="hover:bg-night-2 transition bg-night-1 h-[4.95%] -md flex justify-center items-center absolute"
        style="top:{screenHeight / 1.435}px; width: {screenHeight / 5.51}px;
    transform: translateX({screenHeight / 3.25}%)">
        {progression}%
      </div>
    </div>
  {:else}
    <div class="flex justify-center h-full">
      <div
        class="bg-night-1 h-[4.95%] -md flex justify-center items-center absolute"
        style="top:{screenHeight / 1.435}px; width: {screenHeight / 5.51}px;
    transform: translateX({screenHeight / 3.25}%)" />
    </div>
  {/if}
</div>

<Modal {showModal} on:click={() => (showModal = !showModal)} modalHeader="Branch progress">
  <div class=" flex  justify-around flex-wrap p-4 ">
    {#each possibleBranches as branch}
      <div class="flex flex-col items-center w-32 mb-6">
        <progress
          class="bg-night-1 rounded-[80em] top-5 w-full p-1"
          max="100"
          value={branchProgress[branch] ?? 0} />
        <p class="pt-2">{branch}</p>
      </div>
    {/each}
  </div>
</Modal>

<style>
  progress::-moz-progress-bar {
    background-color: #5e81ac;
    border-radius: 99em;
  }

  progress::-webkit-progress-value {
    background-color: #5e81ac;
    border-radius: 99em;
  }

  progress::-webkit-progress-bar {
    background-color: #5e81ac;
    border-radius: 99em;
  }
</style>
