<script lang="ts">
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
    <div on:keypress class={classes} on:click={() => (message = "")}>
      <p class="break-words">{message}</p>
    </div>
  {/if}
{/if}
