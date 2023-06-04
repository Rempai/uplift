<script lang="ts">
  import { component_subscribe, element_is } from "svelte/internal";
  import BSArrow from "~icons/bxs/down-arrow";

  export let targetElement;

  const props = targetElement.getBoundingClientRect();
  let left = Math.round(props.left);
  let top = Math.round(props.top);
  let width = Math.round(props.width);
  $: console.log(targetElement);
  /*TODO:
Fix:Does not work with custom components, only DOM elements
Need to come up with better ideas for tutorial flow, if this is too difficult.
Probably need to hardcode x,y coordinates for arrow.
*/
</script>

<div class="arrow absolute z-20" style:top="{top + width / 2}px" style:left="{left}px">
  <BSArrow
    class="text-aurora-orange/100 brightness-125 animate-bounce"
    font-size="3em" />
</div>
