<script lang="ts">
  //@ts-nocheck
  import { onDestroy, onMount } from "svelte";
  import { rideQuit, tutorialElements, tutorialImageElements } from "@/lib/stores";
  import BSArrow from "~icons/bxs/down-arrow";

  export let passage;

  let showArrow = false;
  let buttonElements = {};
  let imgElements = {};
  let lastElement;

  let arrowWidth;
  let left = 0;
  let top = 0;
  let width = 0;
  let height = 0;

  onMount(() => {
    buttonElements = {
      rides: document.getElementById("rides"),
      journal: document.getElementById("journal"),
      reviews: document.getElementById("reviews"),
      driversLicense: document.getElementById("driversLicense"),
      achievements: document.getElementById("achievements"),
      radio: document.getElementById("radio"),
      settings: document.getElementById("settings"),
      progress: document.getElementById("storyProgress"),
    };

    imgElements = {
      rides: document.querySelector('img[alt="contacts"]'),
      journal: document.querySelector('img[alt="notes"]'),
      reviews: document.querySelector('img[alt="reviews"]'),
      driversLicense: document.getElementById("driversLicenseIcon"),
      achievements: document.querySelector('img[alt="achievements"]'),
      radio: document.querySelector('img[alt="music"]'),
      settings: document.querySelector('img[alt="settings"]'),
    };

    for (let key in buttonElements) {
      const buttonElement = buttonElements[key];

      if (key != "settings" && key != "radio") {
        buttonElement.classList.add("pointer-events-none");
      }
    }

    for (let key in imgElements) {
      const imgElement = imgElements[key];
      if (key != "settings" && key != "radio") {
        imgElement.classList.add("brightness-50");
      }
    }
    $tutorialElements = buttonElements;
    $tutorialImageElements = imgElements;
  });

  function getElementPosition(targetElement) {
    const props = targetElement.getClientRects();
    left = Math.round(props[0].left);
    top = Math.round(props[0].top);
    if (targetElement.id === "driversLicense") {
      top -= 20;
    }
    height = Math.round(props[0].height);
    width = Math.round(props[0].width);
    showArrow = true;
  }

  const hideElements = () => {
    for (let key in $tutorialImageElements) {
      let element = $tutorialImageElements[key];

      element.classList.remove(
        "border",
        "border-4",
        "border-aurora-yellow/70",
        "rounded",
        "outline-offset-2"
      );
      if (key != "settings" && key != "radio") {
        element.classList.add("brightness-50");
      }
    }

    for (let key in $tutorialElements) {
      let element = $tutorialElements[key];
      if (key != "settings" && key != "radio") {
        element.classList.add("pointer-events-none");
      }
    }
    showArrow = false;
  };

  const highlightElement = (currentElement) => {
    if (currentElement.id !== "storyProgress") {
      const imgElement = $tutorialImageElements[currentElement.id];
      currentElement.classList.remove("pointer-events-none");
      imgElement.classList.remove("brightness-50");
      imgElement.classList.add(
        "border",
        "border-4",
        "border-aurora-yellow/70",
        "rounded",
        "outline-offset-2"
      );
      lastElement = imgElement;
    } else {
      currentElement.classList.remove("pointer-events-none");
      currentElement.classList.add(
        "border",
        "border-4",
        "border-aurora-yellow/70",
        "rounded",
        "outline-offset-2"
      );
      lastElement = currentElement;
    }
  };

  // Remove classes after tutorial is done
  function removeClasses() {
    for (let key in $tutorialElements) {
      const element = $tutorialElements[key];

      element.classList.remove("pointer-events-none");
    }

    for (let key in $tutorialImageElements) {
      const element = $tutorialImageElements[key];
      if (key !== "journal") {
        element.classList.remove(
          "border",
          "border-4",
          "border-aurora-yellow/70",
          "rounded",
          "outline-offset-2",
          "brightness-50"
        );
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
      hideElements();
    } else {
      const foundPassage = Object.keys(keyPassages).find((key) => passage.content.includes(key));
      if (foundPassage !== undefined) {
        getElementPosition(Object.values($tutorialElements)[keyPassages[foundPassage]]);
        highlightElement(Object.values($tutorialElements)[keyPassages[foundPassage]]);
      }
    }
  }

  onDestroy(() => {
    if ($rideQuit !== true) {
      if (!lastElement === $tutorialElements["journal"]) {
        hideElements();
      }
    } else {
      if (lastElement) {
        lastElement.classList.remove(
          "border",
          "border-4",
          "border-aurora-yellow/70",
          "rounded",
          "outline-offset-2"
        );
      }
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
