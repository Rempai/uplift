<script lang="ts">
  import { setContext, createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  import key from "@/components/contextMenu/CustomMenu.svelte";

  export let x;
  export let y;

  let maxWidth = window.innerWidth;
  let maxHeight = window.innerHeight;

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

  $: if (menuEl) {
    test();
    const rect = menuEl.getBoundingClientRect();
    dispatch("dimensions", {
      width: rect.width,
      height: rect.height,
      maxWidth: maxWidth,
      maxHeight: maxHeight,
    });
  }

  function test() {
    if (x > maxWidth - 162) {
      if (y > maxHeight - 158) {
        x = maxWidth - 162;
        y = maxHeight - 158;
      }
      else {
        x = maxWidth - 162
      }
    }
    else if (y > maxHeight - 158) {
      y = maxHeight - 158;
    }
  }
</script>

<svelte:body on:click={onPageClick} />

<div
  transition:fade={{ duration: 100 }}
  bind:this={menuEl}
  style="top: {y}px; left: {x}px;"
  class="rounded bg-night-4 text-storm-1 absolute grid z-[100] shadow border-4 border-night-4 p-2">
  <slot />
</div>