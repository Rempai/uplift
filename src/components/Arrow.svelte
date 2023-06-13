<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import BSArrow from "~icons/bxs/down-arrow";

  export let targetElement;
  export let showArrow: boolean;

  // predefined elements of buttons in multimedia
  let elements = {};

  let arrowWidth;
  let left = 0;
  let top = 0;
  let width = 0;
  let height = 0;

  onMount(() => {
    elements = {
      contacts: document.querySelector('img[alt="contacts"]'),
      notes: document.querySelector('img[alt="notes"]'),
      reviews: document.querySelector('img[alt="reviews"]'),
      license: document.getElementById("diverLicense"),
      achievements: document.querySelector('img[alt="achievements"]'),
      music: document.querySelector('img[alt="music"]'),
      settings: document.querySelector('img[alt="settings"]'),
      progress: document.querySelector(".progresstut"),
    };
  });

  function getElementPosition(targetElement) {
    const props = targetElement.getClientRects();
    left = Math.round(props[0].left);
    top = Math.round(props[0].top);
    height = Math.round(props[0].height);
    width = Math.round(props[0].width);
    showArrow = true;
  }

  const restoreClasses = (timeout: boolean) => {
    if (timeout) {
      setTimeout(() => {
        for (let key in elements) {
          let element = elements[key];
          element.classList.remove(
            "border",
            "border-4",
            "border-aurora-yellow/70",
            "rounded",
            "outline-offset-2"
          );
          element.classList.add("cursor-not-allowed", "brightness-50");
        }
        showArrow = false;
      }, 7000);
    } else {
      for (let key in elements) {
        let element = elements[key];
        element.classList.remove(
          "border",
          "border-4",
          "border-aurora-yellow/70",
          "rounded",
          "outline-offset-2"
        );
        element.classList.add("cursor-not-allowed", "brightness-50");
      }
      showArrow = false;
    }
  };

  const changeClasses = (currentElement) => {
    currentElement.classList.remove("cursor-not-allowed", "brightness-50");

    currentElement.classList.add(
      "border",
      "border-4",
      "border-aurora-yellow/70",
      "rounded",
      "outline-offset-2"
    );
  };

  $: if (targetElement) {
    restoreClasses(false);

    if (targetElement.content.includes("clicking the contacts button")) {
      restoreClasses(true);
      getElementPosition(Object.values(elements)[0]);
      changeClasses(Object.values(elements)[0]);
    } else if (targetElement.content.includes("Try opening the journal")) {
      restoreClasses(true);
      getElementPosition(Object.values(elements)[1]);
      //TODO: Fix icon background
      changeClasses(Object.values(elements)[1]);
    } else if (targetElement.content.includes("the review section")) {
      restoreClasses(true);
      getElementPosition(Object.values(elements)[2]);
      changeClasses(Object.values(elements)[2]);
      /*TODO:
      Fix:Arrow isn't aligning properly on the icon of the driver license, need to fix.
      */
    } else if (targetElement.content.includes("Try opening your license")) {
      restoreClasses(true);
      getElementPosition(Object.values(elements)[3]);
      changeClasses(Object.values(elements)[3]);
    } else if (targetElement.content.includes("by opening the list of achievements")) {
      restoreClasses(true);
      getElementPosition(Object.values(elements)[4]);
      changeClasses(Object.values(elements)[4]);
    } else if (targetElement.content.includes("Try opening your radio menu")) {
      restoreClasses(true);
      getElementPosition(Object.values(elements)[5]);
      changeClasses(Object.values(elements)[5]);
    } else if (targetElement.content.includes("Try opening your settings")) {
      restoreClasses(true);
      getElementPosition(Object.values(elements)[6]);
      changeClasses(Object.values(elements)[6]);
    } else if (targetElement.content.includes("the progress meter here in")) {
      restoreClasses();
      getElementPosition(Object.values(elements)[7]);
      changeClasses(Object.values(elements)[7]);
    }
  }

  onDestroy(() => {
    restoreClasses(false);
  });
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
