<script lang="ts">
  import { fade } from "svelte/transition";
  import { onMount, afterUpdate } from "svelte";

  import { errors } from "@/lib/stores";

  import Button from "@/components/Button.svelte";

  import MaterialSymbolsCancelOutline from '~icons/material-symbols/cancel-outline';

  export let message = "";
  export let id: number;

  let visible = true;

  const deleteError = () => {
    errors.update((e) => e.filter((error) => error.id !== id));
  };

  onMount(() => {
    setTimeout(() => {
      visible = false;
    }, 5000);
  });

  afterUpdate(() => {
    if (!visible) {
      deleteError();
    }
  });
</script>

{#if visible}
  <div class="flex flex-col items-end space-y-4">
    <div
      class="bg-aurora-red p-4 rounded shadow z-50 transition w-80 mt-2 mr-2 cursor-pointer relative"
      on:click={deleteError}
      on:keydown
      transition:fade>
      <Button class="absolute top-2 right-2 !m-0 !p-0 shadow-transparent">
        <div slot="icon">
          <MaterialSymbolsCancelOutline class="text-storm-3" />
        </div>
      </Button>
      <div>
      </div>
      <p>{message}</p>
      <div
        class="progress-bar h-2 rounded bg-[#a8414a] mt-2"
        style={`animation-duration: 5000ms`}
      />
    </div>
  </div>
{/if}

<style>
  .progress-bar {
    animation-name: progress;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }

  @keyframes progress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
</style>
