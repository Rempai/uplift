<script lang="ts">
  import Game from "@/routes/Game.svelte";
  import type { PassageRead } from "@/lib/client";

  export let showPopup: boolean;
  export let progression: number;
  export let allPassages: Array<PassageRead>;
  export let passedPassages: Array<string> = [];

  let brancheProgression = "23%";

  if (showPopup) {
    togglePopup();
  }

  function togglePopup() {
    console.log(progression);
  }

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
    // showPopup = !showPopup;
  };
</script>

<div class="flex justify-center mt-8 w-full">
  <div class="flex flex-col items-center">
    <div
      class="absolute bg-aurora-red p-8 w-fit rounded"
      on:mouseenter={popup}
      on:mouseleave={popup}
      on:click={calcProgression}
      on:keypress>
      {progression}%
    </div>
    {#if showPopup}
      <div class="flex flex-row w-full">
        <div class="bg-aurora-red p-4 rounded px-9">my</div>
        <div class="bg-aurora-red p-4 rounded px-9">Friends</div>
      </div>
    {/if}
  </div>
</div>

<div class=" flex" on:mouseenter={togglePopup} on:mouseleave={togglePopup}>
  <slot />
</div>
