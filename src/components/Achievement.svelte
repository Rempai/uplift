<script lang="ts">
  import { cubicOut, cubicInOut } from "svelte/easing";
  import { fly } from "svelte/transition";
  import { tweened } from "svelte/motion";
  export let achievementTitle = "Congratulations! You've done it!";
  export let iconImage = "icon-outline.png";
  export let triggered = false;
  const rotationAngle = tweened(0);
  const audio = new Audio("achievement-sylized-fx-2.wav");

  const resetTrigger = () => {
    triggered = false;
  };

  $: if (triggered) {
    rotationAngle.set(360, { duration: 3750, easing: cubicOut });
    audio.play();
    setTimeout(resetTrigger, 8000);
  } else {
    rotationAngle.set(0);
    audio.pause();
  }
</script>

{#if triggered}
  <div
    class="top-0 right-0 absolute z-50 mt-4 mr-4 w-96 h-24"
    in:fly={{ x: 525, duration: 700, easing: cubicInOut }}
    out:fly={{ x: 125, duration: 700, easing: cubicOut }}>
    <div id="background" class="bg-night-1 rounded h-full">
      <div
        on:click="{resetTrigger}"
        on:keypress
        id="border"
        class="border-8 border-frost-3 rounded outline outline-8 outline-offset-0 outline-storm-4 flex h-full w-full pl-3 items-center">
        <img
          src={iconImage}
          class="w-16"
          alt="a11y"
          style="transform: rotateY({$rotationAngle * 3}deg);" />
        <div class="flex flex-col justify-center items-center h-full leading-none flex-1">
          <p class="text-storm-3 text-lg">Achievement Unlocked:</p>
          <p class="text-storm-3 text-md flex p-1 align-middle">{achievementTitle}</p>
        </div>
      </div>
    </div>
  </div>
{/if}
