<script lang="ts">
  import { tweened } from "svelte/motion";

  import type { PassageRead } from "@/lib/client";

  export let showPopup: boolean;
  export let progression: number;
  export let allPassages: Array<PassageRead>;
  export let passedPassages: Array<string> = [];

  let knownBranches: Array<string> = [];
  let possibleBranches: Array<string> = [];
  let branch;

  let ding;

  const branches = () => {
    allPassages.forEach((obj) => {
      if (!possibleBranches.find((e) => e === obj.branch) && !obj.branch.includes("Finish")) {
        possibleBranches.push(obj.branch);
      }

      if (!possibleBranches.find((e) => e === obj.passage) && !obj.branch.includes("Finish")) {
        ding.push(obj.passage);
      }
    });

    possibleBranches.forEach((str) => {
      allPassages.forEach((obj) => {
        if (obj.branch.includes(str)) {
        }
      });
    });
    // passedPassages.forEach((str) => {
    //   if (!knownBranches.find((e) => e === str)) {
    //     if () {

    //     }
    //     knownBranches.push(str);
    //   }
    // });

    console.log(knownBranches);
  };

  const calcProgression = () => {
    console.log(allPassages);
    let totalPassages = allPassages.length - 1;
    let seenPassages = passedPassages.length;

    allPassages.forEach((x) => {
      if (x.branch.includes("Finish") || x.emotion < 0) {
        totalPassages = totalPassages - 1;
      }
    });

    progression = Math.round((seenPassages / totalPassages) * 100);
  };

  const popup = () => {
    showPopup = !showPopup;
  };

  const progress1 = tweened(0, { duration: 100 });

  $: {
    if (showPopup) {
      progress1.set(47);
    } else {
      progress1.set(0);
    }
  }
</script>

<div class="flex justify-center mt-5">
  <div class="flex flex-col w-fit h-full items-center">
    <div
      class="absolute bg-aurora-red p-2 w-fit rounded top-20"
      on:mouseenter={branches}
      on:mouseenter={popup}
      on:mouseleave={popup}
      on:click={calcProgression}
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
              value={$progress1} />
            <p>{branch}</p>
          </div>
        {/each}
      </div>
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
    background-color: #5e81ac;
    border-radius: 99em;
  }
</style>
