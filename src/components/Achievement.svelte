<script lang="ts">
  import { cubicOut } from "svelte/easing";
  import { fly } from "svelte/transition";
  import { tweened } from "svelte/motion";

  export let achievementTitle = "Congratulations! You did something right!";
  export let iconImage = "icon-outline.png";
  export let triggered = false;
  // export let achievementDescription = "You're officially the worst person in the world!";
  // export let achievementId;
  const rotationAngle = tweened(0);
  const audio = new Audio("achievement-sylized-fx-2.wav");

  $: console.log("triggered", triggered);
  $: setInterval(() => {
    triggered = false;
  }, 10000);

  $: if (triggered) {
    rotationAngle.set(360, { duration: 3750, easing: cubicOut });
    audio.play();
  } else {
    rotationAngle.set(0);
    audio.pause();
  }
</script>

{#if triggered}
  <div
    class="w-80 h-20 top-0 right-0 absolute z-50 mt-4 mr-4"
    in:fly={{ x: 125, duration: 700, easing: cubicOut }}
    out:fly={{ x: 125, duration: 700, easing: cubicOut }}>
    <div id="background" class="bg-white rounded h-full">
      <div
        id="border"
        class="border-8 border-storm-1 rounded outline outline-8 outline-offset-0 outline-aurora-purple flex h-full w-full pl-3 items-center">
        <img
          src={iconImage}
          class="w-16"
          alt="a11y"
          style="transform: rotateY({$rotationAngle * 3}deg);" />
        <div class="flex flex-col justify-center h-full pl-3 leading-none">
          <p class="text-night-3 text-md">Achievement Unlocked:</p>
          <p class="text-night-3 text-sm flex">{achievementTitle}</p>
        </div>
      </div>
    </div>
  </div>
{/if}

<button class="absolute z-50" on:click={() => (triggered = !triggered)}>transition</button>
