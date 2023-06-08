<script lang="ts">
  import { onMount } from "svelte";
  import BSArrow from "~icons/bxs/down-arrow";

  export let targetElement;
  export let showArrow: boolean;

  // predefined elements of buttons in multimedia

  let contactsElement;
  let achievementsElement;
  let musicElement;
  let notesElement;
  let reviewsElement;
  let settingsElement;
  let licenseElement;
  let progressElement;

  onMount(() => {
    contactsElement = document.querySelector('img[alt="contacts"]');
    progressElement = document.querySelector(".progresstut");
    achievementsElement = document.querySelector('img[alt="achievements"]');
    musicElement = document.querySelector('img[alt="music"]');
    notesElement = document.querySelector('img[alt="notes"]');
    reviewsElement = document.querySelector('img[alt="reviews"]');
    settingsElement = document.querySelector('img[alt="settings"]');
    licenseElement = document.getElementById("diverLicense");
  });

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
      getElementPosition(contactsElement);
      showArrow = true;
    } else if (targetElement.content.includes("Try opening the journal")) {
      getElementPosition(notesElement);
    } else if (targetElement.content.includes("the review section")) {
      getElementPosition(reviewsElement);
      /*TODO:
      Fix:Arrow isn't aligning properly on the icon of the driver license, need to fix.
      */
    } else if (targetElement.content.includes("Try opening your license")) {
      getElementPosition(licenseElement);
    } else if (targetElement.content.includes("by opening the list of achievements")) {
      getElementPosition(achievementsElement);
    } else if (targetElement.content.includes("Try opening your radio menu")) {
      getElementPosition(musicElement);
    } else if (targetElement.content.includes("Try opening your settings")) {
      getElementPosition(settingsElement);
    }
    //TODO: Change passage to right sentence
    else if (targetElement.content.includes("Just before we start")) {
      getElementPosition(progressElement);
    }
  }
</script>

{#if showArrow}
  <div
    bind:clientWidth={arrowWidth}
    id="tutorialArrow"
    class="absolute z-20"
    style:left="{left + (width - arrowWidth) / 2}px"
    style:top="{top - height}px">
    <BSArrow class="text-aurora-orange/100 brightness-125 animate-bounce" font-size="3em" />
  </div>
{/if}
