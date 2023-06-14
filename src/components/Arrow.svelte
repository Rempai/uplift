<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import BSArrow from "~icons/bxs/down-arrow";

  export let targetElement;
  export let showArrow: boolean;

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

  // Remove classes after tutorial is done
  function removeClasses() {
    const elements = document.querySelectorAll(".cursor-not-allowed, .brightness-50");

    elements.forEach((element) => {
      element.classList.remove("cursor-not-allowed", "brightness-50");
    });
  }

  $: if (targetElement) {
    restoreClasses(false);

    const keyPassages = {
      "clicking the contacts button": 0,
      "Try opening the journal": 1,
      "the review section": 2,
      "Try opening your license": 3,
      "by opening the list of achievements": 4,
      "Try opening your radio menu": 5,
      "Try opening your settings": 6,
      "the progress meter here in": 7,
    };

    const foundPassage = Object.keys(keyPassages).find((key) =>
      targetElement.content.includes(key)
    );

    if (foundPassage !== undefined) {
      restoreClasses(true);
      getElementPosition(Object.values(elements)[keyPassages[foundPassage]]);
      changeClasses(Object.values(elements)[keyPassages[foundPassage]]);
    }
  }

  onDestroy(() => {
    restoreClasses(false);
    removeClasses();
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
