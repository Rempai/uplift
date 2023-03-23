<script lang="ts">
  import { location, push } from "svelte-spa-router";

  import { stripPath } from "@/lib/adminLogic";

  export let name: string;
  export let link: string;

  let path: string;

  const linkClass = ` capitalize flex items-center gap-2 w-full text-storm-3 rounded-l pl-3 py-2 mt-2 hover:bg-night-1`;

  $: path = stripPath($location);
  $: name = name.replace(/\/admin\//g, "");
</script>

<button
  on:click={() => push(link)}
  class={path === link ? `bg-night-1 ${linkClass}` : `${linkClass}`}>
  <div class="text-frost-4 w-6 mr-2 flex justify-center">
    <slot />
  </div>
  <p>{name}</p>
</button>
