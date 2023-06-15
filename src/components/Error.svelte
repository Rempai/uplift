<script>
  import { errors } from "@/lib/stores";

  export let message = "";
  export let duration = 5000; // in milliseconds
  export let id;

  setTimeout(function () {
    deleteError(id);
  }, 5000);

  const handleClick = () => {
    deleteError(id);
  };

  const deleteError = (id) => {
    $errors = $errors.filter((error) => error.id !== id);
    $errors = $errors;
  };
</script>

<div class="flex flex-col items-end space-y-4">
  <div
    class="bg-aurora-red text-white p-4 rounded shadow z-50 transition w-80 mt-2 mr-2 cursor-pointer"
    on:click={handleClick}
    on:keydown>
    <p>{message}</p>
    <div
      class="progress-bar h-2 rounded bg-[#a8414a] mt-2"
      style={`animation-duration: ${duration}ms`} />
  </div>
</div>

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
