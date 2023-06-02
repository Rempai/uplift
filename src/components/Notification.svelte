<script lang="ts">
  export let info = false;
  export let messages: string[] = [];

  function removemessages(index: number) {
    messages.splice(index, 1);
  }

  $: {
    if (messages.length > 0) {
      setTimeout(() => {
        messages.pop();
        messages = [...messages];
      }, 5000);
    }
  }
</script>

<div class="absolute top-10 right-10 z-50 flex flex-col items-end space-y-4">
  {#each messages as msg, i}
    <button
      class={`hover:brightness-110 rounded py-2 px-3 w-48 cursor-pointer shadow ${
        info ? "bg-frost-4" : "bg-aurora-red"
      }`}
      on:click={() => removemessages(i)}>
      <div class="flex justify-between gap-2">
        <p class="break-words">{msg}</p>
        <span class="">&times;</span>
      </div>
    </button>
  {/each}
</div>
