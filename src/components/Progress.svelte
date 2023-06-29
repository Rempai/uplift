<script lang="ts">
  import type { PassageRead } from "@/lib/client";

  import Modal from "@/components/Modal.svelte";

  export let allPassages: Array<PassageRead>;
  export let passedPassages: Array<string> = [];
  export let passenger: string;

  let possibleBranches: Array<string> = [];
  let branchProgress: Record<string, number> = {};

  let progression = 0;
  let showModal = false;

  let fontsize = parseFloat(window.getComputedStyle(document.body).getPropertyValue("font-size"));

  const branches = () => {
    allPassages.forEach((obj) => {
      if (!possibleBranches.find((e) => e === obj.branch) && !obj.branch.includes("Finish")) {
        possibleBranches.push(obj.branch);
      }
    });
  };

  const calcProgression = () => {
    possibleBranches.forEach((branch) => {
      const passagesWithBranch = allPassages.filter(
        (obj) => obj.branch === branch && !(obj.emotion < 0)
      );
      const totalBranchPassages = passagesWithBranch.length;

      if (totalBranchPassages > 0) {
        const seenBranchPassages = passedPassages.filter((passage) =>
          passagesWithBranch.some((obj) => obj.passage === passage)
        ).length;

        branchProgress[branch] = Math.ceil((seenBranchPassages / totalBranchPassages) * 100);
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
    if (allPassages && allPassages.length > 0) {
      showModal = !showModal;
    }
  };

  let screenHeight: number = window.innerHeight;
  let screenWidth: number = window.innerWidth;

  window.addEventListener("resize", () => {
    screenHeight = window.innerHeight;
    screenWidth = window.innerWidth;
  });

  $: if (passedPassages) {
    branches();
    calcProgression();
  }
</script>

<Modal
  {showModal}
  on:closed={() => (showModal = !showModal)}
  on:click={() => (showModal = !showModal)}
  modalHeader="Branch progress">
  <div class="flex justify-around flex-wrap p-4">
    {#each possibleBranches as branch}
      <div class="flex flex-col items-center w-32 mb-6">
        <progress
          class="bg-night-1 rounded-[80em] top-5 w-full p-1"
          max="100"
          value={branchProgress[branch] ?? 0} />
        <p class="pt-2 capitalize">
          {#if branch !== "Trunk"}
            {branch.split(passenger.split(" ")[0])[1]}
          {:else}
            {branch}
          {/if}
        </p>
      </div>
    {/each}
  </div>
</Modal>

<div
  class="flex w-fill justify-end absolute z-10"
  style="bottom: {screenHeight / 3.98 / fontsize}em; right: {screenWidth / 3.716 / fontsize}em ">
  <div
    id="storyProgress"
    on:click={popup}
    on:keypress
    class="hover:bg-night-2 transition bg-night-1 flex justify-center items-center cursor-pointer"
    style="height: {screenHeight / 18 / fontsize}em; width: {screenWidth / 11.84 / fontsize}em;">
    {#if allPassages && allPassages.length > 0}
      {progression}%
    {/if}
  </div>
</div>

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
    background-color: #2e3440;
    border-radius: 99em;
  }
</style>
