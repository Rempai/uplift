<script lang="ts">
  type buttonType = "button" | "submit" | "reset";

  export let text = "";
  export let type: buttonType = "button";
  export let href = "";

  let classes = `${$$props.class} rounded text-xl text-center cursor-pointer shadow no-underline transition text-storm-3 hover:text-storm-3 hover:brightness-110 border-2 border-transparent`;

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
  <button {type} class={classes} on:click={onClick}>{text}<slot name="icon" /></button>
{/if}
