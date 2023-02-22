<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { passage_name } from "@/lib/stores";

  import FaChevronRight from "svelte-icons/fa/FaChevronRight.svelte";

  import Button from "@/components/Button.svelte";

  export let user = "You";
  export let dialogColor = "#88C0D0";
  export let speed = 25;
  export let delay = 0;
  export let font = "Roboto";
  export let fontSize = "1.2em";
  export let color = dialogColor;

  export let text: string;
  export let continue_button: boolean;

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

  let branch_name = "";
  Object.defineProperty(window, "branch_name", {
    get: function () {
      return branch_name;
    },

    set: function (val) {
      branch_name = val;
      $passage_name = val;
    },
    configurable: true,
  });
</script>

<div class="flex justify-center px-3">
  <div
    class="relative z-3 max-w-screen-lg w-full bg-night-3 shadow rounded border-4"
    style="border-color: {dialogColor}">
    <div class="flex">
      <div class="h-10 shadow py-1 px-6 rounded-br" style="background-color: {dialogColor}">
        <p class="font-bold text-xl whitespace-nowrap">{user}</p>
      </div>
      <div class="w-full flex justify-start ml-2 h-48">
        {#if text}
          {#await text then parsed_text}
            <p
              style="font-family: {font}; font-size: {fontSize}; color: {color}"
              class="break-words overflow-y-auto h-1/2"
              in:typewriter={{ delay: delay, speed: speed }}>
              {@html parsed_text}
            </p>
          {/await}
          {#if continue_button}
            <span
              style="background-color: {dialogColor}"
              class="rounded absolute bottom-4 right-4"
              on:keypress
              on:click={() => dispatch("next")}>
              <Button text="Continue" class="bg-transparent">
                <div slot="icon" class="w-6 ml-3 text-snow-1">
                  <FaChevronRight />
                </div>
              </Button>
            </span>
          {/if}
          <script>
            branch = (branchName) => {
              branch_name = branchName;
            };
          </script>
        {/if}
      </div>
    </div>
  </div>
</div>
