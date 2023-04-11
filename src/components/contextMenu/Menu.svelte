<script lang="ts">
  import { setContext, createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  import key from "@/components/contextMenu/CustomMenu.svelte";

  export let x;
  export let y;

  let maxWidth = window.innerWidth;
  let maxHeight = window.innerHeight;

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
    const rect = menuEl.getBoundingClientRect();
    dispatch("dimensions", {
      divWidth: Math.ceil(rect.width),
      divHeight: Math.ceil(rect.height),
      maxWidth: maxWidth,
      maxHeight: maxHeight,
    });
  }

  function fixposx(x) {
    if (x > maxWidth - 162) x = maxWidth - 162;
    return x;
  }

  function fixposy(y) {
    if (y > maxHeight - 158) y = maxHeight - 158;
    return y;
  }
</script>

<svelte:body on:click={onPageClick} />

<div
  transition:fade={{ duration: 100 }}
  bind:this={menuEl}
  style="left: {fixposx(x)}px; top: {fixposy(y)}px; width: 162px; height: 158px;"
  class="rounded bg-night-4 text-storm-1 absolute grid z-[100] shadow border-4 border-night-4 p-2">
  <slot />
</div>
