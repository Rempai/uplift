<script lang="ts">
  type buttonType = "button" | "submit" | "reset";

  export let text = "";
  export let type: buttonType = "button";
  export let href = "";
  export let id = "";
  export let ariaLabel = "";
  export let autofocus = false;

  let classes = `${$$props.class} rounded text-2xl text-center cursor-pointer shadow no-underline transition text-storm-3 hover:text-storm-3 hover:brightness-110 px-3 py-2 md:px-5 md:py-2 border-2 border-transparent`;

  export let onClick: () => void = () => {
    console.log;
  };

  if ($$slots.icon) {
    classes = classes + ` flex items-center`;
  }
</script>

{#if href}
  <a {href} class={classes}>{text}<slot name="icon" /></a>
{:else}
  <!-- svelte-ignore a11y-autofocus -->
  <button {type} {autofocus} class={classes} aria-label={ariaLabel} {id} on:click={onClick}
    >{text}<slot name="icon" /></button>
{/if}
