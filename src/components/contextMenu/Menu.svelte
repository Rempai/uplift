<script>
  import { setContext, createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  import key from "@/components/contextMenu/CustomMenu.svelte";

  export let x;
  export let y;

  // whenever x and y is changed, restrict box to be within bounds
  $: (() => {
    if (!menuEl) return;

    const rect = menuEl.getBoundingClientRect();
    x = Math.min(window.innerWidth - rect.width, x);
    if (y > window.innerHeight - rect.height) y -= rect.height;
    // @ts-ignore
  })(x, y);

  const dispatch = createEventDispatcher();

  setContext(key, {
    dispatchClick: () => dispatch("click"),
  });

  let menuEl;
  function onPageClick(e) {
    if (e.target === menuEl || menuEl.contains(e.target)) return;
    dispatch("clickoutside");
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
