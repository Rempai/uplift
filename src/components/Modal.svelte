<script lang="ts">
  export let showModal = false;
  export let modalHeader = "Header";
</script>

{#if showModal}
  <div
    on:keypress
    on:click|self
    class="absolute h-full w-full top-0 left-0 bg-black/90 z-50 flex justify-center items-center px-4">
    <div class="flex flex-col p-5 w-8/12 max-w-screen-xl bg-night-4 rounded">
      <p class="text-frost-1 text-3xl">{modalHeader}</p>
      <hr class="my-5" />
      <slot />
    </div>
  </div>
{/if}
