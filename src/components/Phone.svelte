<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  import IoMdCloseCircleOutline from "svelte-icons/io/IoMdCloseCircleOutline.svelte";
  import GiRoad from "svelte-icons/gi/GiRoad.svelte";
  import IoMdStarOutline from "svelte-icons/io/IoMdStarOutline.svelte";
  import TiHomeOutline from "svelte-icons/ti/TiHomeOutline.svelte";

  import ButtonA from "@/components/Button.svelte";
  import ButtonB from "@/components/Button.svelte";
  import ButtonC from "@/components/Button.svelte";
  import ButtonD from "@/components/Button.svelte";
  import ButtonE from "@/components/Button.svelte";
  import ButtonF from "@/components/Button.svelte";

  export let menuName = "Home";

  let buttons = [
    { button: ButtonA, text: "Choose ride", class: "bg-aurora-red w-64" },
    { button: ButtonB, text: "Achievements", class: "bg-aurora-orange w-64" },
    { button: ButtonC, text: "Reviews", class: "bg-aurora-yellow w-64" },
    { button: ButtonD, text: "Dashboard", class: "bg-frost-4 w-64" },
    { button: ButtonE, text: "Radio", class: "bg-frost-1 w-64" },
    { button: ButtonF, text: "Settings", class: "bg-frost-2 w-64" },
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
  class="w-96 h-3/4 bg-night-1 relative z-[20] rounded overflow-hidden top-1/2
            translate-y-[-50%] shadow flex flex-col">
  <div class="text-2xl font-bold pt-2 pl-2 pb-2 bg-night-2">
    <div class="mx-4 flex justify-between items-center">
      <p>{menuName}</p>
      <button on:click={dispatchClose} class="h-10 text-frost-3">
        <IoMdCloseCircleOutline />
      </button>
    </div>
  </div>
  <div class="overflow-y-auto overflow-x-hidden h-full" in:fade={{ duration: 200 }}>
    {#if $$slots.content}
      <slot name="content" />
    {:else}
      <div class="flex flex-col items-center gap-5 w-full mt-6">
        {#each buttons as button, i}
          <span on:keypress on:click={() => forward(i)}>
            <svelte:component this={button.button} text={button.text} class={button.class} />
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
      <button class="bg-transparent py-3 w-10 text-frost-3"><GiRoad /></button>
    </span>
    <span
      on:keypress
      on:click={() => forward(-1)}
      class="cursor-pointer flex justify-center items-center w-full h-full hover:bg-frost-4 bg-night-3">
      <button class="bg-transparent py-3 w-10 text-frost-3"><TiHomeOutline /></button>
    </span>
    <span
      on:keypress
      on:click={() => forward(2)}
      class="cursor-pointer flex justify-center items-center w-full h-full hover:bg-frost-4 bg-night-3">
      <button class="bg-transparent py-3 w-10 text-frost-3"><IoMdStarOutline /></button>
    </span>
  </div>
</div>
