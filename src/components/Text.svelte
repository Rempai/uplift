<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { rendered, finishedPassageRender } from "@/lib/stores";

  import Button from "@/components/Button.svelte";

  import PhTriangleFill from "~icons/ph/triangle-fill";

  export let speed: number;
  export let delay: number;
  export let font: string;
  export let fontSize: string;
  export let color: string;
  export let text: string;
  export let continueButton: boolean;

  let skipDialog: boolean;
  let dialogPlaying: boolean;

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
        let progress = ~~(totalLength * t);
        if (skipDialog) progress = totalLength;
        const { textNode, range, text } = getCurrentRange(progress);
        const [start, end] = range;

        let textLength;
        if (skipDialog) {
          textLength = end - start;
        } else {
          textLength = progress - start;
        }

        textNode.textContent = text.slice(0, textLength);
        if (textLength === end - start) {
          dialogPlaying = false;
        } else {
          dialogPlaying = true;
        }
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

  const handleClick = () => {
    if (dialogPlaying) {
      skipDialog = true;
    } else {
      skipDialog = false;
      $rendered = false;
      $finishedPassageRender = false;
      dispatch("next");
    }
  };
</script>

{#if text}
  {#if $rendered}
    <p style="font-family: {font}; font-size: {fontSize}; color: {color}">
      {@html text}
    </p>
  {:else}
    <p
      style="font-family: {font}; font-size: {fontSize}; color: {color}"
      in:typewriter={{ delay: delay, speed: speed }}>
      {@html text}
    </p>
  {/if}
  {#if continueButton}
    <Button
      ariaLabel="Continue passage"
      class="!shadow-transparent bottom-6 right-0 absolute !m-0 !p-0 outline-none"
      id="continue"
      autofocus={true}
      onClick={handleClick}>
      <div slot="icon" class="w-fit element">
        <PhTriangleFill font-size="1.5em" class="text-storm-1" />
      </div>
    </Button>
  {/if}
  <script>
    branch = (branchName) => {
      initialBranchName = branchName;
    };
  </script>
{/if}

<style>
  @keyframes upAndDown {
    0% {
      transform: rotate(180deg) translateY(0);
    }
    50% {
      transform: rotate(180deg) translateY(-8px);
    }
    100% {
      transform: rotate(180deg) translateY(0);
    }
  }
  .element {
    animation-name: upAndDown;
    animation-duration: 2s;
    animation-iteration-count: infinite;
  }
</style>
