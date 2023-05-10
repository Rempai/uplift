<script lang="ts">
  import type { PassageRead } from "@/lib/client";

  export let allPassages: Array<PassageRead>;
  export let passedPassages: Array<string> = [];

  let possibleBranches: Array<string> = [];
  let branchProgress: Record<string, number> = {};

  let progression = 0;
  let showPopup = false;

  let isHovered = false;

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
    showPopup = !showPopup;
  };

  let screenHeight: number = window.innerHeight;
  let screenWidth: number = window.innerWidth;

  window.addEventListener("resize", () => {
    screenHeight = window.innerHeight;
    screenWidth = window.innerWidth;
  });
</script>

<!-- <div class="flex justify-center">
  <div class="flex flex-col w-fit h-full items-center">
    <div
      class="absolute bg-aurora-red p-2 w-fit rounded top-20"
      on:mouseenter={branches}
      on:mouseenter={popup}
      on:mouseleave={popup}
      on:mouseenter={calcProgression}
      on:keypress>
      {progression}%
    </div>
    {#if showPopup}
      <div
        class="flex bg-frost-3 justify-around flex-wrap w-1/2 rounded-[3em] p-4 border-2 border-storm-3">
        {#each possibleBranches as branch}
          <div class="flex flex-col items-center w-32 mb-6">
            <progress
              class="bg-night-4 rounded-[80em] top-5 w-full p-1"
              max="100"
              value={branchProgress[branch] ?? 0} />
            <p>{branch}</p>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div> -->
<div>
  <div
    class="flex justify-center h-full"
    on:mouseenter={branches}
    on:mouseenter={popup}
    on:mouseleave={popup}
    on:mouseenter={calcProgression}
    on:keypress>
    <div
      class="bg-night-1 h-[4.9%] -md flex justify-center items-center absolute translate-x-60"
      style="top:{screenHeight / 1.44}px; width: {screenHeight / 5.5}px;">
      {progression}%
    </div>
  </div>
  {#if showPopup}
    <div
      class="flex bg-frost-3 justify-around flex-wrap w-1/2 rounded-[3em] p-4 border-2 border-storm-3">
      {#each possibleBranches as branch}
        <div class="flex flex-col items-center w-32 mb-6">
          <progress
            class="bg-night-4 rounded-[80em] top-5 w-full p-1"
            max="100"
            value={branchProgress[branch] ?? 0} />
          <p>{branch}</p>
        </div>
      {/each}
    </div>
  {/if}
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
    background-color: #5e81ac;
    border-radius: 99em;
  }
</style>
