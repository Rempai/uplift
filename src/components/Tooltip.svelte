<script lang="ts">
  export let title = "";
  export let position = "top" || "bottom" || "left" || "right";

  let styling = "";

  if (position === "top") {
    styling = "absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full -mt-2";
  } else if (position === "bottom") {
    styling = "absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full -mb-2";
  } else if (position === "right") {
    styling = "absolute right-0 transform translate-x-full -mr-2";
  } else if (position === "left") {
    styling = "absolute left-0 transform translate-x-full -ml-2";
  }
</script>

<div class="relative inline-block">
  <span class="tooltip-slot">
    <slot />
  </span>
  <div
    class="tooltip absolute inline-block whitespace-nowrap opacity-0 invisible transition-opacity transition-visibility {styling}">
    {#if title}
      <div class="inline-block px-4 py-2 rounded bg-night-1">{title}</div>
    {:else}
      <slot name="custom-tip" />
    {/if}
  </div>
</div>

<style>
  .tooltip-slot:hover + .tooltip {
    opacity: 1;
    visibility: initial;
  }
</style>
