<script lang="ts">
  import { component_subscribe, element_is } from "svelte/internal";
  import BSArrow from "~icons/bxs/down-arrow";

  export let targetElement;
  export let showArrow: boolean;

  // predefined elements of buttons in multimedia
  let achievementsElement = document.querySelector('img[alt="achievements"]');
  let contactsElement = document.querySelector('img[alt="contacts"]');
  let musicElement = document.querySelector('img[alt="music"]');
  let notesElement = document.querySelector('img[alt="notes"]');
  let reviewsElement = document.querySelector('img[alt="reviews"]');
  let settingsElement = document.querySelector('img[alt="settings"]');
  let licenseElement = document.querySelector('.testing');


let left;
let top;
let width;

  async function getRoundedBoundingClientRect(targetElement) {
  const props = await targetElement.getBoundingClientRect();
  left = Math.round(props.left);
  top = Math.round(props.top);
  width = Math.round(props.width);
}

  $: if(targetElement && targetElement.content.includes('clicking the contacts button')){
showArrow = true;
    getRoundedBoundingClientRect(contactsElement);
  } else if(targetElement.content.includes('Try opening the journal')) {
    getRoundedBoundingClientRect(notesElement);
  } else if(targetElement.content.includes('purpose we have the review section')){
    getRoundedBoundingClientRect(reviewsElement);
/*TODO:
  Fix:Arrow isn't aligning properly on the icon of the driver license, need to fix.
*/
  } else if(targetElement.content.includes('Try opening your license')){
    getRoundedBoundingClientRect(licenseElement);
  } else if(targetElement.content.includes('by opening the list of achievements')){
    getRoundedBoundingClientRect(achievementsElement);
  } else if(targetElement.content.includes('Try opening your radio menu')){
    getRoundedBoundingClientRect(musicElement);
  } else if(targetElement.content.includes('Try opening your settings')){
    getRoundedBoundingClientRect(settingsElement);
  }



  // const props = targetElement.getBoundingClientRect();
  // let left = Math.round(props.left);
  // let top = Math.round(props.top);
  // let width = Math.round(props.width);

  /*TODO:
Fix:Does not work with custom components, only DOM elements
Need to come up with better ideas for tutorial flow, if this is too difficult.
Probably need to hardcode x,y coordinates for arrow.
*/
</script>
{#if showArrow}
<div class="arrow absolute z-20" style:top="{top / 1.1}px" style:left="{left}px">
  <BSArrow
    class="text-aurora-orange/100 brightness-125 animate-bounce"
    font-size="3em" />
</div>
{/if}
