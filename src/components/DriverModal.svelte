<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { AchievementRead, ReviewRead } from "@/lib/client";

  import Button from "@/components/Button.svelte";

  import IoIosChevronBackOutline from "~icons/ion/chevron-back-outline";
  import IoIosChevronForwardOutline from "~icons/ion/chevron-forward-outline";
  import IonStar from "~icons/ion/star";
  import IonStarOutline from "~icons/ion/star-outline";
  import IonHalfStar from "~icons/ion/star-half";

  export let showDriverModal: boolean;

  export let username: string;
  export let lang: string;
  export let reviewList: Array<ReviewRead>;
  export let allAchievements: Array<AchievementRead>;
  export let unlockedAchievements: Array<AchievementRead>;

  let dialog: HTMLDialogElement;
  let rate: number;
  const dispatch = createEventDispatcher();

  $: if (dialog && showDriverModal) dialog.showModal();

  let colors = ["aurora-orange", "aurora-red", "aurora-yellow", "aurora-green", "aurora-purple"]; // array of predefined colors
  let currentColorIndex = Number(localStorage.getItem("currentColorIndex")) || 0;

  function changeColor(direction) {
    if (direction === "left") {
      currentColorIndex = (currentColorIndex - 1 + colors.length) % colors.length;
    } else {
      currentColorIndex = (currentColorIndex + 1) % colors.length;
    }

    //Achievement changed driver's license colour
    handleAchievement(3);
    localStorage.setItem("currentColorIndex", currentColorIndex.toString());
  }

  $: bgColor = colors[currentColorIndex];

  const getReviewAverage = () => {
    const totalReviews = reviewList.reduce((acc, curr) => {
      return acc + curr.stars;
    }, 0);
    const avg = totalReviews / reviewList.length;
    rate = Math.round(avg * 2) / 2;
  };

  const handleAchievement = (id: number) => {
    dispatch("achievement", { id });
  };
  $: if (reviewList) getReviewAverage();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
  bind:this={dialog}
  on:close={() => (showDriverModal = false)}
  on:click|self={() => dialog.close()}
  class="w-4/5 h-3/5 md:w-full md:h-full overflow-hidden bg-{bgColor} bg-[url('/license.png')] bg-cover bg-center rounded-[10%] max-h-96 max-w-xl border-4 border-night-1"
  style="background-size: 100% 100%">
  <div class="flex flex-col h-full pt-5">
    <div class="flex items-center h-full w-full" on:click|stopPropagation>
      <button on:click|preventDefault={() => changeColor("left")}
        ><IoIosChevronBackOutline font-size="1.7em" class="relative right-3" /></button>
      <div class="basis-1/3 flex-none" />
      <div class="flex flex-col basis-2/3 gap-1">
        <span>Name: {username}</span>
        <span>Age: 23</span>
        <span>Country: {lang}</span>
        <span>Achievements: {unlockedAchievements.length}/{allAchievements.length}</span>
        <Button
          class="!border-night-1 bg-slate-300 hover:bg-storm-3 !text-night-1 text-2xl w-fit"
          text="Close License"
          onClick={() => dialog.close()} />
      </div>
      <button on:click|preventDefault={() => changeColor("right")} type="button"
        ><IoIosChevronForwardOutline font-size="1.7em" /></button>
    </div>
    <div class="flex items-center text-lg justify-center">
      <span class="mr-1">AVG. Rating:</span>
      <span class="flex">
        {#each { length: 5 } as _, i}
          {#if i < Math.floor(rate)}
            <IonStar
              font-size="1em"
              class={rate === 5 && i < 5 ? "w-5 text-aurora-yellow" : "w-5"} />
          {:else if i === Math.floor(rate) && rate % 1 !== 0}
            <IonHalfStar font-size="1em" class="w-5" />
          {:else}
            <IonStarOutline font-size="1em" class="w-5" />
          {/if}
        {/each}
      </span>
    </div>
  </div>
</dialog>

<style>
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.6);
  }
  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }
  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
