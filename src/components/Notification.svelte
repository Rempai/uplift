<script lang="ts">
  import { get } from "svelte/store";
  import { error_message } from "@/lib/stores"

  export let visible = true;
  export let info = false;

  const errormessage = get(error_message);

  let classes = `hover:brightness-110 rounded py-2 px-3 w-48 absolute top-10 right-10 z-[99] cursor-pointer shadow`;

  if (info) {
    classes = classes + ` bg-frost-4`;
  } else {
    classes = classes + ` bg-aurora-red`;
  }
</script>

{#if visible}
  {#if errormessage}
    <div on:keypress class={classes} on:click={() => (visible = !visible)}>
      {#each errormessage as text}
        <p class="break-words">{text}</p>
      {/each}
    </div>
  {/if}
{/if}
