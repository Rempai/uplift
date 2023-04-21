<script lang="ts">
  import { setContext, createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  import key from "@/components/contextMenu/CustomMenu.svelte";

  export let x;
  export let y;

  let maxWidth = window.innerWidth;
  let maxHeight = window.innerHeight;
  let width = 12;
  let height = 10;
  let fontsize = parseFloat(window.getComputedStyle(document.body).getPropertyValue("font-size"));

  const dispatch = createEventDispatcher();

  setContext(key, {
    dispatchClick: () => dispatch("click"),
  });

  let menuEl;
  function onPageClick(e) {
    if (e.target === menuEl || menuEl.contains(e.target)) return;
    dispatch("clickoutside");
  }

  function fixposx(x) {
    if (x > maxWidth - width * fontsize) x = maxWidth - width * fontsize;
    return x;
  }

  function fixposy(y) {
    if (y > maxHeight - height * fontsize) y = maxHeight - height * fontsize;
    return y;
  }
</script>

<svelte:body on:click={onPageClick} />

<div
  transition:fade={{ duration: 100 }}
  bind:this={menuEl}
  style="left: {fixposx(x)}px; top: {fixposy(y)}px; width: {width}em; height: {height}em;"
  class="rounded bg-night-4 text-storm-1 absolute justify-center grid z-[100] shadow border-4 border-night-2 py-0.5">
  <slot />
</div>
