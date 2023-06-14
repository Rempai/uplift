<script>
  import { createEventDispatcher, onMount } from "svelte";

  export let message = "";
  export let duration = 5000; // in milliseconds
  export let id;

  const dispatch = createEventDispatcher();

  onMount(() => {
    setTimeout(() => {
      dispatch("removeMessage", id);
    }, duration);
  });

  const handleClick = () => {
    dispatch("removeMessage", id);
  };
</script>

<div class="flex flex-col items-end space-y-4">
  <div
    class=" bg-aurora-red text-white p-4 rounded shadow z-50 transition w-80 mt-2 mr-2 cursor-pointer"
    on:click={handleClick}
    on:keydown>
    <p>{message}</p>
    <div
      class="progress-bar h-2 rounded bg-[#a8414a] mt-2"
      style={`animation-duration: ${duration}ms`} />
  </div>
</div>

<style>
  .error p {
    margin: 0;
  }

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
