<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";
  import { rideQuit, rendered } from "@/lib/stores";
  import BSArrow from "~icons/bxs/down-arrow";

  export let passage;

  let showArrow = false;
  let elements = {};
  let element;

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

    for (let key in elements) {
      const element = elements[key];
      if (key != "journal") {
        element.classList.add("cursor-not-allowed", "brightness-50");
      }
    }
  });

  function getElementPosition(targetElement) {
    const props = targetElement.getClientRects();
    left = Math.round(props[0].left);
    top = Math.round(props[0].top);
    height = Math.round(props[0].height);
    width = Math.round(props[0].width);
    showArrow = true;
  }

  const restoreClasses = () => {
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
    element = currentElement;
  };

  // Remove classes after tutorial is done
  function removeClasses() {
    for (let key in elements) {
      const element = elements[key];
      if (key !== "journal") {
        element.classList.remove("cursor-not-allowed", "brightness-50");
      }
    }
  }

  $: if (passage) {
    const keyPassages = {
      "clicking the contacts button": 0,
      "Try opening the journal": 1,
      "the review section": 2,
      "Try opening your licence": 3,
      "by opening the list of achievements": 4,
      "Try opening your radio menu": 5,
      "Try opening your settings": 6,
      "the progress meter here in": 7,
    };

    if (
      passage.content.includes("You could go more in depth about") ||
      passage.content.includes("Mistakes happen.") ||
      passage.content.includes("You are almost finished") ||
      passage.content.includes("Now that you have finished this branch")
    ) {
      restoreClasses();
    } else {
      const foundPassage = Object.keys(keyPassages).find((key) => passage.content.includes(key));

      if (foundPassage !== undefined && $rendered === false) {
        getElementPosition(Object.values(elements)[keyPassages[foundPassage]]);
        changeClasses(Object.values(elements)[keyPassages[foundPassage]]);
      }
    }
  }

  onDestroy(() => {
    tick();
    if ($rideQuit !== true) {
      restoreClasses();
    } else {
      element.classList.remove(
        "border",
        "border-4",
        "border-aurora-yellow/70",
        "rounded",
        "outline-offset-2"
      );
      removeClasses();
    }
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
