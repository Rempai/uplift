<script>
  import { onMount } from "svelte";

  export let items = [];
  export let activeTabValue;
  export let passenger;

  onMount(() => {
    if (Array.isArray(items) && items.length && items[0].value) {
      activeTabValue = items[0].value;
    }
  });

  const handleClick = (tabValue) => () => (activeTabValue = tabValue);
</script>

<ul class="flex-col flex-wrap w-full items-center">
  {#if Array.isArray(items)}
    {#each items as item}
      <li
        class={activeTabValue === item.value
          ? "hover:bg-frost-2 bg-frost-3 border-b-4 border-night-1 h-[3.9rem] flex items-center"
          : "hover:bg-frost-2 border-b-4 border-night-1 h-[3.9rem] flex items-center"}>
        <span
          on:keypress
          on:click={handleClick(item.value)}
          class="px-2 py-3 cursor-pointer whitespace-nowrap inline-flex justify-center items-center w-full capitalize">
          {#if item.label !== "Trunk"}
            {item.label.split(passenger)[1]}
          {:else}
            {item.label}
          {/if}
        </span>
      </li>
    {/each}
  {/if}
</ul>
