<script>
  import { onMount } from "svelte";

  export let items = [];
  export let activeTabValue;

  onMount(() => {
    if (Array.isArray(items) && items.length && items[0].value) {
      activeTabValue = items[0].value;
    }
  });

  const handleClick = (tabValue) => () => (activeTabValue = tabValue);
</script>

<ul class="flex flex-wrap w-full">
  {#if Array.isArray(items)}
    {#each items as item}
      <li
        class={activeTabValue === item.value
          ? "hover:bg-frost-2 bg-frost-3 border border-frost-1 w-full"
          : "hover:bg-frost-2 border border-frost-1 w-full"}>
        <span
          on:keypress
          on:click={handleClick(item.value)}
          class="px-2 py-3 cursor-pointer whitespace-nowrap inline-flex justify-center">
          {item.label}
        </span>
      </li>
    {/each}
  {/if}
</ul>

<style>
  ul li:first-child,
  ul li:first-child span {
    width: 100%;
    border-top-left-radius: 55%;
  }
</style>
