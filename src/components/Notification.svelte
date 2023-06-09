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
  {#each messages as msg, index}
    <div
      class="relative message-container hover:brightness-110 rounded py-2 px-3 w-48 cursor-pointer shadow bg-aurora-red">
      <div class="message animate-fade-out" on:animationend={() => removemessages(index)}>
        <p class="break-words">{msg}</p>
      </div>
      <div class="progress-bar animate-progress-bar" />
    </div>
  {/each}
</div>

<style>
  @keyframes fade-out {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes progress-bar {
    0% {
      width: 0%;
    }
    100% {
      width: 100%;
    }
  }

  .message-container {
    position: relative;
  }

  .progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 5px;
    background-color: #4caf50;
    animation: progress-bar 5s linear forwards;
  }
</style>
