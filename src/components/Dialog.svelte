<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import {
    emotion,
    passageName,
    previousEmotion,
    expression,
    finishedPassageRender,
    parsedJWT,
  } from "@/lib/stores";

  import MingcuteUser4Fill from "~icons/mingcute/user-4-fill";

  import Text from "@/components/Text.svelte";

  export let user = "You";
  export let speed = 25;
  export let delay = 0;
  export let font = "Roboto";
  export let fontSize = "1.2em";
  export let color = "#88C0D0";
  export let text: string;
  export let continueButton: boolean;

  let happyBaseUrl = "_happy.png";
  let normalBaseUrl = ".png";
  let angryBaseUrl = "_angry.png";
  let annoyedBaseUrl = "_annoyed.png";
  let fulUrl = "expressions/";

  const dispatch = createEventDispatcher();

  const handleClick = () => {
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

  $: if (text) {
    $finishedPassageRender = true;
  }
</script>

<div class="flex mx-auto relative max-w-5xl bg-night-1 h-56 rounded">
  <div class="flex flex-col w-[99%] h-[95%] m-auto border-4 border-storm-1 bg-night-1 rounded">
    <div class="flex absolute w-full bottom-[11.35em]">
      <img src="logowhite.png" alt="" class="h-16 w-20 mx-auto" />
    </div>
    <div class="flex">
      <div class="flex flex-col h-full pt-2">
        <div class="flex justify-center">
          <p class="font-extrabold" style="color: {color};">
            {#if user == "You"}
              {$parsedJWT.username}
            {:else}
              {user}
            {/if}
          </p>
        </div>
        <div>
          {#if user == "You"}
            <MingcuteUser4Fill class="h-44 w-44" />
          {:else if $expression === "normal"}
            <img src={user.toLowerCase() + normalBaseUrl} alt="" class="h-44 w-44 pb-2 pl-1" />
          {:else if $expression === "happy"}
            <img
              src={fulUrl + user.toLowerCase() + happyBaseUrl}
              alt=""
              class="h-44 w-44 pb-2 pl-1" />
          {:else if $expression === "annoyed"}
            <img
              src={fulUrl + user.toLowerCase() + annoyedBaseUrl}
              alt=""
              class="h-44 w-44 pb-2 pl-1" />
          {:else if $expression === "angry"}
            <img
              src={fulUrl + user.toLowerCase() + angryBaseUrl}
              alt=""
              class="h-44 w-44 pb-2 pl-1" />
          {/if}
        </div>
      </div>
      <div class="flex justify-center items-center mx-4 h-full w-4/5 relative">
        {#if $finishedPassageRender}
          <Text
            on:next={handleClick}
            {speed}
            {delay}
            {font}
            {fontSize}
            {color}
            {text}
            {continueButton} />
        {/if}
      </div>
    </div>
  </div>
</div>
