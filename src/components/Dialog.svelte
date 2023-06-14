<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { emotion, passageName, previousEmotion, expression, rendered } from "@/lib/stores";

  import Button from "@/components/Button.svelte";

  import PhTriangleFill from "~icons/ph/triangle-fill";
  import MingcuteUser4Fill from "~icons/mingcute/user-4-fill";

  export let user = "You";
  export let dialogColor = "#88C0D0";
  export let speed = 25;
  export let delay = 0;
  export let font = "Roboto";
  export let fontSize = "1.2em";
  export let color = dialogColor;
  export let text: string;
  export let continueButton: boolean;

  let happyBaseUrl = "_happy.png";
  let normalBaseUrl = ".png";
  let angryBaseUrl = "_angry.png";
  let annoyedBaseUrl = "_annoyed.png";
  let fulUrl = "expressions/";

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

  const handleClick = () => {
    $rendered = false;
    dispatch("next");
  };

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

  $: if (user !== "You") {
    if ($previousEmotion < $emotion) {
      $expression = "happy";
    } else if ($previousEmotion > $emotion) {
      if ($expression === "annoyed") {
        $expression = "angry";
      } else if ($expression === "angry") {
        $expression = "annoyed";
      } else {
        $expression = "annoyed";
      }
    } else {
      $expression = "normal";
    }

    $previousEmotion = $emotion;
  }
</script>

<div class="flex 2xl:mx-auto relative max-w-5xl bg-night-1 h-56 rounded mx-4">
  <div class="flex flex-col w-[99%] h-[95%] m-auto border-4 border-storm-1 bg-night-1 rounded">
    <div class="flex absolute w-full bottom-[11.35em]">
      <img src="logowhite.png" alt="" class="h-16 w-20 mx-auto" />
    </div>
    <div class="flex">
      <div class="flex flex-col h-full p-2">
        <div class="flex justify-center">
          <p class="font-extrabold" style="color: {color};">{user}</p>
        </div>
        <div>
          {#if user == "You"}
            <MingcuteUser4Fill font-size="2em" class="h-44 w-44" />
          {:else if $expression === "normal"}
            <img src={user.toLowerCase() + normalBaseUrl} alt="" class="h-44 w-44 pb-2" />
          {:else if $expression === "happy"}
            <img src={fulUrl + user.toLowerCase() + happyBaseUrl} alt="" class="h-44 w-44 pb-2" />
          {:else if $expression === "annoyed"}
            <img
              src={fulUrl + user.toLowerCase() + annoyedBaseUrl}
              alt=""
              class="h-44 w-44 pb-2" />
          {:else if $expression === "angry"}
            <img src={fulUrl + user.toLowerCase() + angryBaseUrl} alt="" class="h-44 w-44 pb-2" />
          {/if}
        </div>
      </div>
      <div class="flex justify-center items-center mx-4 h-full w-4/5 relative">
        {#if text}
          {#await text then parsedText}
            <p
              style="font-family: {font}; font-size: {fontSize}; color: {color}"
              in:typewriter={{ delay: delay, speed: speed }}>
              {@html parsedText}
            </p>
          {/await}
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
      </div>
    </div>
  </div>
</div>

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
