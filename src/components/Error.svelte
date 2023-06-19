<script>
  import { errors } from "@/lib/stores";
  import { fade } from "svelte/transition";

  export let message = "";
  export let id;

  const deleteError = () => {
    errors.update((e) => e.filter((error) => error.id !== id));
  };
</script>

<div class="flex flex-col items-end space-y-4">
  <div
    class="bg-aurora-red text-white p-4 rounded shadow z-50 transition w-80 mt-2 mr-2 cursor-pointer"
    on:click={deleteError}
    on:keydown
    transition:fade>
    <p>{message}</p>
    <!-- <div
      class="progress-bar h-2 rounded bg-[#a8414a] mt-2"
      style={`animation-duration: 5000ms`}
      /> -->
  </div>
</div>

<!-- <style>
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
</style> -->
