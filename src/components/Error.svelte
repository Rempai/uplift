<script>
  import { createEventDispatcher, onMount } from "svelte";

  export let message = "";
  export let duration = 5000; // in milliseconds
  export let id;

  const dispatch = createEventDispatcher();

  console.log(id);

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
  <div class="error" on:click={handleClick} on:keydown>
    <p>{message}</p>
    <div class="progress-bar" style={`animation-duration: ${duration}ms`} />
  </div>
</div>

<style>
  .error {
    background-color: red;
    color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    z-index: 9999;
    transition: opacity 0.3s ease-in-out;
    animation-fill-mode: forwards;
    animation-timing-function: ease-out;
  }

  .error p {
    margin: 0;
  }

  .progress-bar {
    height: 5px;
    background-color: rgba(255, 255, 255, 0.5);
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
