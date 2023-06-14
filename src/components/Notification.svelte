<script lang="ts">
  export let info = false;
  export let messages: string[] = [];
  let newMessages: string[];

  $: {
    newMessages = [...messages];
  }

  function removemessages(index: number) {
    messages.splice(index, 1);
  }

  $: {
    if (messages.length > 0) {
      setTimeout(() => {
        messages.pop();
        newMessages = [...messages];
      }, 5000);
    } else {
      newMessages = [];
    }
  }
</script>

<!-- TODO: press to dismiss toevoegen -->

<div class="absolute top-10 right-10 z-50 flex flex-col items-end">
  {#each newMessages as msg, index}
    <div
      class="relative message-container hover:brightness-110 rounded py-2 px-3 w-48 mb-5 cursor-pointer shadow {info
        ? 'bg-frost-1'
        : 'bg-aurora-red'}">
      <div class="message animate-fade-out mb-2" on:animationend={() => removemessages(index)}>
        <p class="break-words">{msg}</p>
      </div>
      <div class="progress-bar animate-progress-bar rounded-bl bg-gray-300" />
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
      /* we are ending the progress bar prematurely because it doesn't have a right border-radius and so it would through the box */
      width: 97.5%;
    }
  }

  .message-container {
    position: relative;
  }

  .progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 8px;
    background-color: #a8414a; /* Adjust the color as needed */
    animation: progress-bar 5s linear forwards;
  }
</style>
