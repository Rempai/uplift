<script lang="ts">
  import { createEventDispatcher, onDestroy } from "svelte";
  import { cubicOut, cubicInOut } from "svelte/easing";
  import { fly } from "svelte/transition";
  import { tweened } from "svelte/motion";

  // export let achievementTitle = "You've unlocked an achievement!";
  export let iconImage = "icon-outline.png";
  export let triggerAchievement = false;
  export let achievementCarousel;

  const rotationAngle = tweened(0);
  const audio = new Audio("achievement-sylized-fx-2.mp3");
  const dispatch = createEventDispatcher();

  $: if (achievementCarousel) {
    if (triggerAchievement === true) {
      audio.play();
      rotationAngle.set(360, { duration: 3750, easing: cubicOut });
      setTimeout(() => {
        dispatch("killAchievement");
      }, 8000);
    } else {
      rotationAngle.set(0);
      audio.pause();
    }
  }

  onDestroy(() => {
    dispatch("killAchievement");
    rotationAngle.set(0);
    audio.pause();
  });
</script>

<div class="fixed top-0 right-0 z-50 overflow-visible cursor-pointer">
  {#each achievementCarousel as ach}
    <div
      class="mt-4 mr-4 w-96 h-24"
      in:fly={{ x: 525, duration: 700, easing: cubicInOut }}
      out:fly={{ x: 125, duration: 700, easing: cubicOut }}>
      <div id="background" class="bg-night-1 rounded h-full">
        <div
          on:click={() => dispatch("killAchievement")}
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
            <p class="text-storm-3 text-md flex p-1 align-middle">{ach}</p>
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>
