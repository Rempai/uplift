<script lang="ts">
  import type { ReviewRead } from "@/lib/client";
  import IoIosChevronBackOutline from "~icons/ion/chevron-back-outline";
  import IoIosChevronForwardOutline from "~icons/ion/chevron-forward-outline";
  import IonStar from "~icons/ion/star";
  import IonStarOutline from "~icons/ion/star-outline";
  import IonHalfStar from "~icons/ion/star-half";

  export let showDriverModal;
  export let username: string;
  export let reviewList: Array<ReviewRead>;

  let dialog;
  let rate;

  $: if (dialog && showDriverModal) dialog.showModal();

  let colors = ["aurora-red", "aurora-orange", "aurora-yellow", "aurora-green", "aurora-purple"]; // array of predefined colors
  let currentColorIndex = Number(localStorage.getItem("currentColorIndex")) || 0;

  function changeColor(direction) {
    if (direction === "left") {
      currentColorIndex = (currentColorIndex - 1 + colors.length) % colors.length;
    } else {
      currentColorIndex = (currentColorIndex + 1) % colors.length;
    }

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

  $: if (reviewList) getReviewAverage();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
  bind:this={dialog}
  on:close={() => (showDriverModal = false)}
  on:click|self={() => dialog.close()}
  class="w-1/3 h-2/5 overflow-hidden bg-{bgColor} bg-[url('/rijbewijs_feedback_noarrows.png')] bg-cover before:absolute before:inset-0 before:z-[-99] select-none rounded-[10%] p-0">
  <div class="flex flex-col h-full pt-5">

    <div class="flex justify-between items-center h-5/6 pt-4" on:click|stopPropagation>
      <div class="leftArrow">
        <button on:click|preventDefault={() => changeColor("left")} type="button"
          ><IoIosChevronBackOutline font-size="1.7em" /></button>
      </div>


      <div class="basis-1/3 flex-none"></div>


      <div class="licenseContent flex flex-col basis-2/3 text-2xl">
        <span>Name: {username}</span>
        <span>Age: 23</span>
        <span>Country: NL</span>
        <span>Achievements: 3/5</span>
        <button
          class="w-1/2 mt-3 border-2 rounded border-black bg-slate-300 hover:bg-storm-3 text-2xl px-0"
          on:click={() => dialog.close()}>Close menu</button>
      </div>


      <div class="rightArrow">
        <button on:click|preventDefault={() => changeColor("right")} type="button"
          ><IoIosChevronForwardOutline font-size="1.7em" /></button>
      </div>
    </div>
    <div class="flex flex-row items-center justify-end w-4/5 text-xl">
      <span class="mr-1">AVG. Rating:</span>
      <span class="flex flex-row">
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
