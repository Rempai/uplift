<script lang="ts">
  import BSArrow from "~icons/bxs/down-arrow";

  export let targetElement;
  export let showArrow: boolean;

  // predefined elements of buttons in multimedia
  let elements = {
    contactsElement: document.querySelector('img[alt="contacts"]'),
    achievementsElement: document.querySelector('img[alt="achievements"]'),
    musicElement: document.querySelector('img[alt="music"]'),
    notesElement: document.querySelector('img[alt="notes"]'),
    reviewsElement: document.querySelector('img[alt="reviews"]'),
    settingsElement: document.querySelector('img[alt="settings"]'),
    licenseElement: document.getElementById("diverLicense"),
  };

  let arrowWidth;
  let left = 0;
  let top = 0;
  let width = 0;
  let height = 0;

  function getElementPosition(targetElement) {
    const props = targetElement.getClientRects();
    left = Math.round(props[0].left);
    top = Math.round(props[0].top);
    height = Math.round(props[0].height);
    width = Math.round(props[0].width);
  }

  $: if (targetElement) {
    if (targetElement.content.includes("clicking the contacts button")) {
      getElementPosition(elements.contactsElement);
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
  }

  /*TODO:
Fix:Does not work with custom components, only DOM elements
Need to come up with better ideas for tutorial flow, if this is too difficult.
Probably need to hardcode x,y coordinates for arrow.
*/
</script>

{#if showArrow}
  <div
    bind:clientWidth={arrowWidth}
    id="tutorialArrow"
    class="absolute z-20"
    style:left="{left + (width - arrowWidth) / 2}px"
    style:top="{top - height / 2}px">
    <BSArrow class="text-aurora-orange/100 brightness-125 animate-bounce" font-size="3em" />
  </div>
{/if}
