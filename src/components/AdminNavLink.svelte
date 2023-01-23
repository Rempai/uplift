<script lang="ts">
  import { location, push } from "svelte-spa-router";

  import { stripPath } from "@/lib/adminLogic";

  export let name: string;
  export let link: string;

  let path: string;

  const link_class = ` text-start flex items-center gap-2 w-full text-storm-3 rounded-l pl-3 py-2 mt-2 hover:bg-night-1`;

  $: path = stripPath($location);
</script>

<button
  on:click={() => push(link)}
  class={path === link ? `bg-night-1 ${link_class}` : `${link_class}`}>
  <div class="text-frost-4 w-6 h-5 mr-2">
    <slot />
  </div>
  <p>{name}</p>
</button>
