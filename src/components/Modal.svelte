<script lang="ts">
  import Button from "@/components/Button.svelte";
  import { createEventDispatcher } from "svelte";

  import IoIosClose from "~icons/ion/close-outline";

  export let showModal = false;
  export let closeButton = true;
  export let modalHeader = "Header";

  const dispatch = createEventDispatcher();
</script>

{#if showModal}
  <div
    on:keypress
    on:click|self
    class="fixed inset-0 z-50 bg-black/90 flex justify-center items-center pt-2">
    <div
      class="bg-night-4 p-5 rounded max-h-80 xl:max-h-[35em] w-8/12 max-w-screen-xl overflow-y-auto border-4 border-night-3">
      {#if modalHeader}
        <div class="flex items-center justify-between">
          <p class="text-frost-1 text-4xl font-black">{modalHeader}</p>
          {#if closeButton}
            <Button
              onClick={() => {
                dispatch("closed");
                showModal = false;
              }}
              class="!shadow-transparent !p-1">
              <div slot="icon">
                <IoIosClose font-size="2em" class="text-aurora-red" />
              </div>
            </Button>
          {/if}
        </div>
        <hr class="my-5" />
      {/if}
      <slot />
    </div>
  </div>
{/if}
