<script lang="ts">
  import Game from "@/routes/Game.svelte";
  import { get } from "svelte/store";

  export let visible = true;
  export let info = false;
  export let message;

  let classes = `hover:brightness-110 rounded py-2 px-3 w-48 absolute top-10 right-10 z-[99] cursor-pointer shadow`;

  if (info) {
    classes = classes + ` bg-frost-4`;
  } else {
    classes = classes + ` bg-aurora-red`;
  }
</script>

{#if visible}
  {#if message}
    {#each message as text}
      <div on:keypress class={classes} on:click={() => (visible = !visible)}>
        <p class="break-words">{text}</p>
      </div>
    {/each}
  {/if}
{/if}
