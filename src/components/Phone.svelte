<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  import IoIosCloseCircleOutline from "~icons/ion/close-circle-outline";
  import GiRoad from "~icons/game-icons/road";
  import IoIosStarOutline from "~icons/ion/star-outline";
  import IoIosHomeOutline from "~icons/ion/home-outline";

  import Button from "@/components/Button.svelte";

  export let menuName = "Home";

  let buttons = [
    { text: "Choose ride", class: "bg-aurora-red w-64" },
    { text: "Achievements", class: "bg-aurora-orange w-64" },
    { text: "Reviews", class: "bg-aurora-yellow w-64" },
    { text: "Dashboard", class: "bg-frost-4 w-64" },
    { text: "Radio", class: "bg-frost-1 w-64" },
    { text: "Settings", class: "bg-frost-2 w-64" },
  ];

  const dispatch = createEventDispatcher();

  const forward = (detail: number) => {
    dispatch("item", detail + 1);
  };

  const dispatchClose = () => {
    dispatch("close");
  };
</script>

<div
  class="w-[20em] h-3/4 bg-night-1 relative z-[20] rounded overflow-hidden top-1/2
            translate-y-[-50%] shadow flex flex-col">
  <div class="text-2xl font-bold pt-2 pl-2 pb-2 bg-night-2">
    <div class="mx-4 flex justify-between items-center">
      <p>{menuName}</p>
      <button on:click={dispatchClose}>
        <IoIosCloseCircleOutline font-size="1.8em" class="text-frost-1" />
      </button>
    </div>
  </div>
  <div class="overflow-y-auto overflow-x-hidden h-full pb-4" in:fade={{ duration: 200 }}>
    {#if $$slots.content}
      <slot name="content" />
    {:else}
      <div class="flex flex-col items-center gap-5 w-full mt-6">
        {#each buttons as button, i}
          <span on:keypress on:click={() => forward(i)}>
            <svelte:component this={Button} text={button.text} class={button.class} />
          </span>
        {/each}
      </div>
    {/if}
  </div>
  <div class="bg-night-2 flex justify-around">
    <span
      on:keypress
      on:click={() => forward(0)}
      class="cursor-pointer flex justify-center items-center w-full h-full hover:bg-frost-4 bg-night-3">
      <button class="py-3"><GiRoad font-size="2em" class="text-aurora-orange" /></button>
    </span>
    <span
      on:keypress
      on:click={() => forward(-1)}
      class="cursor-pointer flex justify-center items-center w-full h-full hover:bg-frost-4 bg-night-3">
      <button><IoIosHomeOutline font-size="2em" class="text-aurora-orange" /></button>
    </span>
    <span
      on:keypress
      on:click={() => forward(2)}
      class="cursor-pointer flex justify-center items-center w-full h-full hover:bg-frost-4 bg-night-3">
      <button><IoIosStarOutline font-size="2em" class="text-aurora-orange" /></button>
    </span>
  </div>
</div>
