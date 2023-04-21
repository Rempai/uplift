<script lang="ts">
  import type { PassageRead } from "@/lib/client";
  import { createEventDispatcher } from "svelte";

  export let passage: PassageRead | null = null;

  let dialogToggled = false;
  const dispatch = createEventDispatcher();

  const forward = (detail: number) => {
    dispatch("item", detail + 1);
  };

  const dialog = () => {
    if (passage !== null) {
      dispatch("dialog");
      dialogToggled = !dialogToggled;
    }
  };

  $: dialogIconSrc =
    passage && dialogToggled
      ? "multimedia/Dialogue_white_icon.png"
      : passage
      ? "multimedia/Dialogue_green_icon.png"
      : "multimedia/Dialogue_red_icon.png";
</script>

<div
  class="bg-night-1 h-[8.68em] w-[13.1em] fixed z-10 bottom-[2.87em] left-1/2 transform -translate-x-1/2 rounded-md flex flex-row">
  <div
    class="flex flex-col items-center justify-evenly w-12 bg-white/10 mr-2"
    style="border-radius: 6px">
    <img
      src="multimedia/Home_icon.png"
      alt="info"
      class="w-6 h-6 cursor-pointer"
      on:click={() => forward(-1)}
      on:keydown />
    <img
      src="multimedia/Info_Icon.png"
      alt="info"
      class="w-6 h-6 cursor-pointer"
      on:click={() => forward(2)}
      on:keydown />
    <img
      src={dialogIconSrc}
      alt="info"
      class="w-6 h-6 cursor-pointer"
      on:click={dialog}
      on:keydown />
  </div>

  <!-- this section -->
  <div class="flex flex-col flex-1 justify-center">
    <div class="flex gap-2 p-2">
      <img
        src="multimedia/Achievements_icon.png"
        alt="achievements"
        class="w-full h-full cursor-pointer"
        on:click={() => forward(1)}
        on:keydown />
      <img
        src="multimedia/Contacts_icon.png"
        alt="contacts"
        class="w-full h-full cursor-pointer"
        on:click={() => forward(0)}
        on:keydown />
      <img
        src="multimedia/Music_icon.png"
        alt="music"
        class="w-full h-full cursor-pointer"
        on:click={() => forward(4)}
        on:keydown />
    </div>
    <div class="flex gap-2 p-2">
      <img
        src="multimedia/Notes_icon.png"
        alt="notes"
        class="w-full h-full cursor-pointer"
        on:click={() => forward(3)}
        on:keydown />
      <!-- drivers license hier? -->
      <img
        src="multimedia/Reviews_icon.png"
        alt="notes"
        class="w-full h-full cursor-pointer"
        on:click={() => forward(2)}
        on:keydown />
      <img
        src="multimedia/Settings_icon.png"
        alt="settings"
        class="w-full h-full cursor-pointer"
        on:click={() => forward(5)}
        on:keydown />
    </div>
  </div>
</div>
