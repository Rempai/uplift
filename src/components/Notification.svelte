<script lang="ts">
  import { tweened } from "svelte/motion";

  export let info = false;
  export let messages: string[] = [];

  let alertClasses = `hover:brightness-110 rounded py-2 px-3 w-48 cursor-pointer shadow ${
    info ? "bg-frost-4" : "bg-aurora-red"
  }`;

  function removeMessages(index: number) {
    messages.splice(index, 1);
  }

  const progressBarWidth = tweened(0, {
    duration: 5000,
  });

  function startProgressBar() {
    progressBarWidth.set(100);
  }

  $: if (messages.length > 0) {
    startProgressBar();

    setTimeout(() => {
      messages.splice(messages.length - 1, 1);
    }, 5000);
  }
</script>

<div class="absolute top-10 right-10 z-50 flex flex-col items-end space-y-4">
  {#each messages as msg, i}
    <button class={alertClasses} on:click={() => removeMessages(i)}>
      <div class="h-2 bg-night-3 rounded">
        <div class="h-full bg-frost-1 rounded" style="width: {$progressBarWidth}%" />
      </div>
      <div class="flex justify-between gap-2">
        <p class="break-words">{msg}</p>
        <span>&times;</span>
      </div>
    </button>
  {/each}
</div>
