<script>
  import { getContext } from "svelte";

  import key from "@/components/contextMenu/CustomMenu.svelte";

  export let isDisabled = false;
  export let text = "";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  const { dispatchClick } = getContext(key);

  const handleClick = () => {
    if (isDisabled) return;

    dispatch("click");
    dispatchClick();
  };
</script>

<div
  class:disabled={isDisabled}
  on:click={handleClick}
  on:keypress
  class="rounded cursor-pointer gap-2 flex items-center px-5 hover:bg-night-3 disabled:text-night-1 disabled:bg-night-2 disabled:cursor-not-allowed">
  {#if text}
    {text}
  {:else}
    <slot />
  {/if}
</div>
