<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { passageName, rendered } from "@/lib/stores";

  import MdChevronRight from "~icons/mdi/chevron-right";

  import Button from "@/components/Button.svelte";

  export let user = "You";
  export let dialogColor = "#88C0D0";
  export let speed = 25;
  export let delay = 0;
  export let font = "Roboto";
  export let fontSize = "1.2em";
  export let color = dialogColor;

  export let text: string;
  export let continueButton: boolean;

  const dispatch = createEventDispatcher();

  function typewriter(node, { delay, speed }) {
    const textNodes = getAllTextNodes(node);

    if (!textNodes.length) {
      throw new Error(`This transition only works on elements with text nodes`);
    }

    let totalLength = 0;
    const ranges = textNodes.map((textNode) => {
      const range = [totalLength, totalLength + textNode.textContent.length];
      totalLength += textNode.textContent.length;
      const text = textNode.textContent;
      textNode.textContent = "";
      return { textNode, range, text };
    });

    let currentRangeIndex = 0;
    function getCurrentRange(i) {
      while (ranges[currentRangeIndex].range[1] < i && currentRangeIndex < ranges.length) {
        const { textNode, text } = ranges[currentRangeIndex];
        textNode.textContent = text; // finish typing up the last node
        currentRangeIndex++;
      }
      return ranges[currentRangeIndex];
    }
    const duration = totalLength * speed;

    return {
      delay,
      duration,
      tick: (t) => {
        const progress = ~~(totalLength * t);
        const { textNode, range, text } = getCurrentRange(progress);
        const [start, end] = range;
        const textLength = ((progress - start) / (end - start)) * text.length;
        textNode.textContent = text.slice(0, textLength);
      },
    };
  }

  function getAllTextNodes(node) {
    if (node.nodeType === 3) {
      return [node];
    } else if (node.hasChildNodes()) {
      let list = [];
      for (let child of node.childNodes) {
        getAllTextNodes(child).forEach((textNode) => list.push(textNode));
      }
      return list;
    }
    return [];
  }

  let initialBranchName = "";
  Object.defineProperty(window, "initialBranchName", {
    get: function () {
      return initialBranchName;
    },

    set: function (val) {
      initialBranchName = val;
      $passageName = val;
    },
    configurable: true,
  });

  const handleClick = () => {
    $rendered = false;
    dispatch("next");
  };
</script>

<div class="flex justify-center px-3">
  <div
    class="relative max-w-screen-lg w-full bg-night-3 shadow rounded border-4"
    style="border-color: {dialogColor}">
    <div class="flex">
      <div class="h-10 shadow py-1 px-6 rounded-br" style="background-color: {dialogColor}">
        <p class="font-bold text-xl whitespace-nowrap">{user}</p>
      </div>
      <div class="w-full flex justify-start ml-2 h-48">
        {#if text}
          {#await text then parsedText}
            {#if $rendered}
              <p
                style="font-family: {font}; font-size: {fontSize}; color: {color}"
                class="break-words overflow-y-auto h-1/2">
                {@html parsedText}
              </p>
            {:else}
              <p
                style="font-family: {font}; font-size: {fontSize}; color: {color}"
                class="break-words overflow-y-auto h-1/2"
                in:typewriter={{ delay: delay, speed: speed }}>
                {@html parsedText}
              </p>
            {/if}
          {/await}
          {#if continueButton}
            <span
              style="background-color: {dialogColor}"
              class="rounded absolute bottom-4 right-4">
              <Button
                ariaLabel="Continue passage"
                id="continue"
                autofocus={true}
                onClick={handleClick}
                text="Continue">
                <div slot="icon" class="w-6 ml-3">
                  <MdChevronRight font-size="2em" class="text-storm-1" />
                </div>
              </Button>
            </span>
          {/if}
          <script>
            branch = (branchName) => {
              initialBranchName = branchName;
            };
          </script>
        {/if}
      </div>
    </div>
  </div>
</div>
