<script lang="ts">
  import { setContext, createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  import key from "@/components/contextMenu/CustomMenu.svelte";

  export let x;
  export let y;

  let width: number;
  let height: number;

  // whenever x and y is changed, restrict box to be within bounds
  $: if ((x, y))
    () => {
      if (!menuEl) return;
    };

  const dispatch = createEventDispatcher();

  setContext(key, {
    dispatchClick: () => dispatch("click"),
  });

  let menuEl;
  function onPageClick(e) {
    if (e.target === menuEl || menuEl.contains(e.target)) return;
    dispatch("clickoutside");
  }

  function getDimensions() {
    dispatch("getDimensions", {
      width: width,
      height: height,
    });
  }

  $: if (menuEl) {
    const rect = menuEl.getBoundingClientRect();
    dispatch("dimensions", {
      width: rect.width,
      height: rect.height,
    });
  }
</script>

<svelte:body on:click={getDimensions} on:click={onPageClick} />

<div
  transition:fade={{ duration: 100 }}
  bind:this={menuEl}
  style="top: {y}px; left: {x}px;"
  class="rounded bg-night-4 text-storm-1 absolute grid z-[100] shadow border-4 border-night-4 p-2">
  <slot />
</div>
