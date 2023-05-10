<script lang="ts">
  export let info = false;
  export let message: string[] = [];

  const containerClasses = "absolute top-10 right-10 z-50 flex flex-col items-end space-y-4";

  let alertClasses = "hover:brightness-110 rounded py-2 px-3 w-48 cursor-pointer shadow";

  if (info) {
    alertClasses = `${alertClasses} bg-frost-4`;
  } else {
    alertClasses = `${alertClasses} bg-aurora-red`;
  }

  function removeMessage(index: number) {
    message = [...message.slice(0, index), ...message.slice(index + 1)];
  }

  $: if (message.length > 0) {
    setTimeout(() => {
      message.splice(message.length - 1, 1);
      message = [...message]; // trigger update
    }, 5000);
  }
</script>

<div class={containerClasses}>
  {#each message as msg, i}
    <button class={alertClasses} on:click={() => removeMessage(i)}>
      <div class="flex justify-between gap-2">
        <p class="break-words">{msg}</p>
        <span class="">&times;</span>
      </div>
    </button>
  {/each}
</div>
