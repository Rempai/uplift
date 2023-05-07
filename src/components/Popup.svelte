<script lang="ts">
  import Game from "@/routes/Game.svelte";
  import type { PassageRead } from "@/lib/client";

  export let showPopup: boolean;
  export let progression: number;
  export let allPassages: Array<PassageRead>;
  export let passedPassages: Array<string> = [];
  export let branchData: Array<PassageRead>;

  let knownBranches: Array<string> = [];
  let possibleBranches = [];

  const fontcare = () => {
    console.log("fuck");
    branchData.forEach((obj) => {
      console.log(knownBranches);

      if (knownBranches.length == 0) {
        knownBranches[0] = "test";
        console.log(knownBranches);
      }
    });
  };

  const calcProgression = () => {
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
</script>

<div class="flex justify-center mt-5 w-full h-10">
  <div class="flex flex-col items-center">
    <div
      class="absolute bg-aurora-red p-8 w-fit rounded top-14 "
      on:mouseenter={fontcare}
      on:mouseenter={popup}
      on:mouseleave={popup}
      on:click={calcProgression}
      on:keypress>
      {progression}%
    </div>
    {#if showPopup}
      <div class="flex flex-row w-full items-center">
        <div class="bg-aurora-yellow p-4 rounded px-3 mx-0.5 text-night-4">Friends</div>
        <div class="bg-aurora-green p-4 rounded px-3 mx-0.5 text-night-4">Stress</div>
        <div class="bg-aurora-red p-4 rounded px-3 mx-0.5 text-night-4">Project</div>
        <div class="bg-aurora-purple p-4 rounded px-3 mx-0.5 text-night-4">Trunk</div>
        <div class="bg-aurora-orange p-4 rounded px-3 mx-0.5 text-night-4">Workload</div>
      </div>
    {/if}
  </div>
</div>
