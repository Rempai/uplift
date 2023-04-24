<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  import IoIosCloseCircleOutline from "~icons/ion/close-circle-outline";

  export let menuName = "Home";

  const dispatch = createEventDispatcher();

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
        <IoIosCloseCircleOutline font-size="1.8em" class="text-aurora-orange" />
      </button>
    </div>
  </div>
  <div class="overflow-y-auto overflow-x-hidden h-full pb-4" in:fade={{ duration: 200 }}>
    {#if $$slots.content}
      <slot name="content" />
    {/if}
  </div>
</div>
