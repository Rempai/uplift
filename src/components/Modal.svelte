<script lang="ts">
  import IoIosClose from "~icons/ion/close-outline";

  export let showModal = false;
  export let modalHeader = "Header";
</script>

{#if showModal}
  <div
    on:keypress
    on:click|self
    class="fixed inset-0 z-50 overflow-y-auto bg-black/90 flex justify-center items-center pt-2">
    <div class="bg-night-4 p-5 rounded max-h-screen w-8/12 max-w-screen-xl overflow-y-auto">
      <div class="flex items-center justify-between">
        <p class="text-frost-1 text-2xl font-black">{modalHeader}</p>
        <span on:click={() => (showModal = false)} on:keydown class="cursor-pointer">
          <IoIosClose font-size="2em" class="text-storm-1" />
        </span>
      </div>
      <hr class="my-5" />
      <div class="h-full overflow-y-auto">
        <slot />
      </div>
    </div>
  </div>
{/if}
