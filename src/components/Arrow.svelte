<script lang="ts">
  import BSArrow from "~icons/bxs/down-arrow";

  export let targetElement;
  export let showArrow: boolean;

  // predefined elements of buttons in multimedia
  let elements = {
    achievementsElement: document.querySelector('img[alt="achievements"]'),
    contactsElement: document.querySelector('img[alt="contacts"]'),
    musicElement: document.querySelector('img[alt="music"]'),
    notesElement: document.querySelector('img[alt="notes"]'),
    reviewsElement: document.querySelector('img[alt="reviews"]'),
    settingsElement: document.querySelector('img[alt="settings"]'),
    licenseElement: document.getElementById("diver"),
  };

  let left;
  let top;
  let width, height;
  let x, y;

  function getElementPosition(targetElement) {
    const props = targetElement.getClientRects();
    left = Math.round(props[0].left);
    top = Math.round(props[0].top);
    x = Math.round(props[0].x);
    y = Math.round(props[0].y);
    height = Math.round(props[0].height);
    width = Math.round(props[0].width);
  }

  $: if (targetElement && targetElement.content.includes("clicking the contacts button")) {
    showArrow = true;
  } else if (targetElement.content.includes("Try opening the journal")) {
    getElementPosition(elements.notesElement);
  } else if (targetElement.content.includes("the review section")) {
    getElementPosition(elements.reviewsElement);
    /*TODO:
  Fix:Arrow isn't aligning properly on the icon of the driver license, need to fix.
*/
  } else if (targetElement.content.includes("Try opening your license")) {
    getElementPosition(elements.licenseElement);
  } else if (targetElement.content.includes("by opening the list of achievements")) {
    getElementPosition(elements.achievementsElement);
  } else if (targetElement.content.includes("Try opening your radio menu")) {
    getElementPosition(elements.musicElement);
  } else if (targetElement.content.includes("Try opening your settings")) {
    getElementPosition(elements.settingsElement);
  }

  /*TODO:
Fix:Does not work with custom components, only DOM elements
Need to come up with better ideas for tutorial flow, if this is too difficult.
Probably need to hardcode x,y coordinates for arrow.
*/
  $: console.log(elements.contactsElement.getClientRects());
</script>

{#if showArrow}
  <div
    class="absolute z-20 animate-bounce"
    style:left="{left + width / 16}px"
    style:top="{top - height}px">
    <BSArrow class="text-aurora-orange/100 brightness-125" font-size="3em" />
  </div>
{/if}
