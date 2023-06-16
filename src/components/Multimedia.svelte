<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type { AchievementRead, PassageRead, ReviewRead, RideRead } from "@/lib/client";

  import { radios } from "@/lib/radio";
  import { parsedJWT } from "@/lib/stores";

  import Modal from "@/components/Modal.svelte";
  import Button from "@/components/Button.svelte";
  import Form from "@/components/Form.svelte";
  import Tooltip from "@/components/Tooltip.svelte";

  import IoIosCard from "~icons/ion/card-outline";
  import IoIosLocationOutline from "~icons/ion/location-outline";
  import IoIosStarOutline from "~icons/ion/star-outline";
  import TiTime from "~icons/typcn/time";
  import FaRoute from "~icons/fa6-solid/route";
  import IoIosCalendar from "~icons/ion/calendar";
  import IonStar from "~icons/ion/star";
  import IonStarOutline from "~icons/ion/star-outline";
  import ClarityLicenseSolid from "~icons/clarity/license-solid";
  import MSLock from "~icons/material-symbols/lock";

  export let passage: PassageRead | null = null;
  export let showReviewList: boolean;
  export let reviewList: Array<ReviewRead>;
  export let rideList: Array<RideRead>;
  export let filledjournal: boolean;
  export let journal: boolean;
  export let modalOpened: boolean;
  export let animalese: boolean;

  export let allAchievements: Array<AchievementRead>;
  export let unlockedAchievementsIds = [];

  export let audioAmbient;
  export let volumeAmbient: number;
  export let ambientNoise: boolean;

  let dialogToggled = false;
  let journalToggled = false;
  let activeContent: string;
  let modalHeader = "Menu";
  let singleReviewData = {
    passenger: "",
    text: "",
  };
  let radioSelect: number;
  let volumeRadio = 1;
  let audioRadio;

  let showInfo = false;

  let screenHeight: number = window.innerHeight;
  let screenWidth: number = window.innerWidth;

  const dispatch = createEventDispatcher();

  const forward = (pressedItem: string, headerTitle?: string) => {
    activeContent = pressedItem;
    modalHeader = headerTitle || pressedItem || "Menu";
    handleModal();
  };

  const forwardNotToggle = (pressedItem: string, headerTitle?: string) => {
    activeContent = pressedItem;
    modalHeader = headerTitle || pressedItem || "Menu";
  };

  const handleModal = () => {
    if (activeContent === "Reviews") dispatch("toggleReview");
    if (activeContent === "Achievements") dispatch("getAchievements");
    if (modalOpened === true) activeContent = null;
    journal = !journal;
    // modalHeader = "Menu"; // reset modal header to an empty string
    modalOpened = !modalOpened;
  };

  const updateAccount = async ({ target }) => {
    dispatch("updateAccount", target);
  };

  const showSingleReview = (review: ReviewRead) => {
    activeContent = "SingleReview";
    singleReviewData = {
      passenger: review.ride.passenger.name,
      text: review.description,
    };
    modalHeader = `${review.ride.passenger.name}'s review (${formatDate(review.date)})`; // set the modal header to the passenger name
  };

  const dialog = () => {
    if (passage) {
      dispatch("dialog");
      dialogToggled = !dialogToggled;
    }
  };

  const select = (data: RideRead) => {
    modalOpened = false;
    dispatch("select", data);
  };

  const toggleJournal = () => {
    if (passage && filledjournal) {
      dispatch("journalPressed");
      journalToggled = !journalToggled;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-BR", { dateStyle: "short", timeStyle: "short", hour12: false });
  };

  const getReviewStars = (data: RideRead) => {
    const review = reviewList.reduce((prevReview, currentReview) => {
      if (currentReview.ride.passenger.name === data.passenger.name) {
        if (!prevReview) {
          return currentReview;
        }
        if (currentReview.stars > prevReview.stars) {
          return currentReview;
        }
      }
      return prevReview;
    }, null);
    return review ? review.stars : null;
  };

  const handleAchievement = (achievementId: number) => {
    // TODO: Achievement emotion meter: emotion stays above level whole game
    dispatch("achievement", { achievementId });
  };

  window.addEventListener("resize", () => {
    screenHeight = window.innerHeight;
    screenWidth = window.innerWidth;
  });

  function handleVolumeChangeAmbient(event) {
    volumeAmbient = event.target.value;
    audioAmbient.volume = volumeAmbient;
  }

  function handleVolumeChangeRadio(event) {
    volumeRadio = event.target.value;
    audioRadio.volume = volumeRadio;
  }

  function handleAudioLoadedRadio() {
    // eslint-disable-next-line  @typescript-eslint/no-this-alias
    audioRadio = this;
  }

  const toggleCheatSheet = () => {
    showInfo = !showInfo;
  };

  let colors = ["aurora-orange", "aurora-red", "aurora-yellow", "aurora-green", "aurora-purple"];
  let currentColorIndex = Number(localStorage.getItem("currentColorIndex")) || 0;
  $: bgColor = colors[currentColorIndex];

  $: if (showReviewList) {
    forward("Reviews");
  }

  $: if ($parsedJWT) {
    modalOpened = false;
  }

  $: if (reviewList) {
    reviewList = reviewList.reverse();
  }
  //Achievement coolsong
  $: if (radioSelect === 4) {
    handleAchievement(5);
  }

  $: dialogIconSrc =
    passage && dialogToggled
      ? "multimedia/Dialogue_white_icon.png"
      : passage
      ? "multimedia/Dialogue_green_icon.png"
      : "multimedia/Dialogue_red_icon.png";
</script>

{#if radioSelect}
  <audio
    class="hidden"
    autoplay
    controls
    loop
    src={radios[radioSelect].source}
    on:loadedmetadata={handleAudioLoadedRadio}
    volume={volumeRadio} />
{/if}

{#if showInfo}
  <img
    src="cheatsheet.png"
    alt=""
    class="absolute h-screen w-full bg-center bg-cover bg-no-repeat z-20"
    style="background-size: 100% 100%"
    on:click={toggleCheatSheet}
    on:keypress />
{/if}

<Modal showModal={modalOpened} on:click={handleModal} {modalHeader} on:closed={handleModal}>
  {#if activeContent === "Achievements"}
    <div class="px-4 mt-3 max-w-lg mx-auto">
      <div class="flex justify-center flex-wrap gap-3">
        {#each allAchievements as ach}
          {#if unlockedAchievementsIds}
            {#if unlockedAchievementsIds.includes(ach.id)}
              <div class="relative">
                <Tooltip title={ach.description} position={"top"}>
                  <div
                    class="cursor-pointer hover:brightness-110 rounded border-2 border-storm-3 w-20 h-20 flex justify-center items-center bg-contain bg-fixed bg-center">
                    <img src={ach.icon} alt="" />
                  </div>
                </Tooltip>
              </div>
            {:else}
              <Tooltip title={ach.description} position={"top"}>
                <div
                  class="text-xl py-4 px-2 cursor-pointer bg-aurora-red/40 hover:bg-aurora-red rounded border-dashed border-2 border-storm-3 w-20 h-20 flex justify-center items-center">
                  <span class="text-2xl">
                    <MSLock class="text-storm-3" />
                  </span>
                </div>
              </Tooltip>
            {/if}
          {/if}
        {/each}
      </div>
    </div>
  {:else if activeContent === "Reviews"}
    <div class="px-4 mt-3">
      {#if reviewList.length}
        {#each reviewList as data}
          <div
            class="mb-6 gap-3 w-full rounded flex items-center hover:bg-night-2 cursor-pointer"
            on:click={() => showSingleReview(data)}
            on:keypress>
            <img class="rounded w-24 h-full" src={data.ride.passenger.icon} alt="" />
            <div class="overflow-x-hidden whitespace-nowrap">
              <p class="flex items-center">
                <IoIosCard font-size="1.2em" class="mr-2" />
                {data.ride.passenger.name}
              </p>
              <p class="flex items-center">
                <IoIosCalendar font-size="1.2em" class="mr-2" />
                {formatDate(data.date)}
              </p>
              <div class="inline-flex items-center">
                {#each Array(data.stars) as _}
                  {#if data.stars === 5}
                    <IonStar font-size="1.2em" class="w-5 mr-2 text-aurora-yellow" />
                  {:else}
                    <IonStar class="w-5 mr-2" font-size="1.2em" />
                  {/if}
                {/each}
                {#if data.stars < 5}
                  {#each Array(5 - data.stars) as _}
                    <IoIosStarOutline class="w-5 mr-2 text-frost-3" font-size="1.2em" />
                  {/each}
                {/if}
              </div>
              <p class="text-ellipsis overflow-hidden">{data.description}</p>
            </div>
          </div>
          <hr class="border-night-2 m-2 w-11/12 mx-auto" />
        {/each}
      {:else}
        <p class="text-center w-full">
          You have no reviews, please <span
            class="text-aurora-orange cursor-pointer"
            on:keypress
            on:click={() => {
              handleModal(), forward("Rides");
            }}>select a ride</span>
        </p>
      {/if}
    </div>
  {:else if activeContent === "Rides"}
    <div class="px-4 my-2">
      <div class="pt-2 pb-2">
        {#if rideList.length}
          {#if passage}
            <p class="text-center w-full">You are already in a ride.</p>
            {#if filledjournal && reviewList.length > 0}
              <div class="flex mt-3 justify-center">
                <Button
                  onClick={() => dispatch("quitRide")}
                  text="Quit ride"
                  class="bg-aurora-red w-fit" />
              </div>
            {/if}
          {:else}
            {#await rideList then ride}
              {#each ride as data}
                <button class="w-full" on:keypress on:click={() => select(data)}>
                  <div class="hover:bg-night-2 cursor-pointer rounded">
                    <div class="gap-3 w-full flex items-center">
                      <img class="rounded w-24 h-full m-2 pb-1" src={data.passenger.icon} alt="" />
                      <div>
                        <p class="flex items-center">
                          <IoIosCard font-size="1.2em" class="mr-2" />{data.passenger.name}
                        </p>
                        <p class="flex items-center">
                          <IoIosLocationOutline
                            font-size="1.2em"
                            class="mr-2" />{data.fromLocation}
                        </p>
                        <p class="flex items-center">
                          <FaRoute font-size="1.2em" class="mr-2" />{data.toLocation}
                        </p>
                        <p class="flex items-center">
                          <TiTime font-size="1.2em" class="mr-2" />{data.time} minutes
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center ml-2 gap-1 pb-2">
                      <p>Personal best:</p>
                      <div class="flex">
                        {#each { length: 5 } as _, i}
                          {#if i < getReviewStars(data)}
                            <IonStar
                              font-size="1em"
                              class={getReviewStars(data) === 5 && i < 5
                                ? "w-5 text-aurora-yellow"
                                : "w-5"} />
                          {:else}
                            <IonStarOutline font-size="1em" class="w-5" />
                          {/if}
                        {/each}
                      </div>
                    </div>
                  </div>
                  <hr class="border-night-2 m-2 w-11/12 mx-auto" />
                </button>
              {/each}
            {/await}
          {/if}
        {:else}
          <p class="text-center w-full">There are no rides you can take.</p>
        {/if}
      </div>
    </div>
  {:else if activeContent === "Radio"}
    <div class="px-4 my-3 flex flex-col items-center gap-3">
      {#if passage}
        {#if animalese}
          <Button
            onClick={() => {
              if (passage) {
                dispatch("toggleAnimalese");
              }
            }}
            text="Disable Animalese"
            class="bg-aurora-orange" />
        {:else}
          <Button
            onClick={() => {
              if (passage) {
                dispatch("toggleAnimalese");
              }
            }}
            text="Enable Animalese"
            class="bg-aurora-green" />
        {/if}
        <Button
          onClick={() => {
            if (passage) {
              dispatch("toggleAmbient");
            }
          }}
          text="Toggle Ambient Noise"
          class="bg-frost-4" />
      {/if}
      {#if ambientNoise}
        <input
          class="mt-5"
          type="range"
          id="ambient-slider"
          min="0"
          max="1"
          step="0.1"
          value={0.5}
          on:input={handleVolumeChangeAmbient} />
      {/if}
      {#if passage}
        <hr class="m-5 w-96 border-night-2" />
      {/if}
      <select name="station" bind:value={radioSelect} class="p-3 bg-frost-4 rounded">
        {#each radios as radio}
          <option value={radio.id}>{radio.name}</option>
        {/each}
      </select>
      {#if radioSelect}
        <input
          class="mt-5"
          type="range"
          id="volume-slider"
          min="0"
          max="1"
          step="0.1"
          value={0.5}
          on:input={handleVolumeChangeRadio} />
        <Button
          onClick={() => (radioSelect = 0)}
          text="Stop"
          class="mt-5 p-3 !border-aurora-red hover:bg-aurora-red" />
      {/if}
    </div>
  {:else if activeContent === "Settings"}
    <div class="px-4 my-3">
      <div class="flex flex-col items-center justify-center gap-5">
        <Button
          onClick={() => {
            forwardNotToggle("ChangeUsername", "Change Username");
          }}
          text="Username"
          class="bg-aurora-purple w-full max-w-xs" />
        <Button
          onClick={() => {
            forwardNotToggle("ChangePassword", "Change Password");
          }}
          text="Password"
          class="bg-aurora-orange w-full max-w-xs" />
        <Button
          onClick={() => {
            dispatch("logout"), (modalOpened = false);
          }}
          text="Logout"
          class="bg-aurora-green w-full max-w-xs" />
        <Button
          onClick={() => forwardNotToggle("DeleteAccount", "Delete Account")}
          text="Delete account"
          class="bg-aurora-red w-full max-w-xs" />
      </div>
    </div>
  {:else if activeContent === "ChangeUsername" || activeContent === "ChangePassword"}
    <div class="px-4 mb-3">
      <Form handleSubmit={updateAccount}>
        <div slot="forms">
          {#if activeContent == "ChangeUsername"}
            <label for="username">New Username</label>
            <input required placeholder="test123" name="username" type="text" />
          {:else if activeContent == "ChangePassword"}
            <label for="password">Password</label>
            <input required placeholder="password" name="password" type="password" />
            <label for="newPassword">New password</label>
            <input required placeholder="New password" name="newPassword" type="password" />
            <label for="repeatPassword">Repeat password</label>
            <input required placeholder="Repeat password" name="repeatPassword" type="password" />
          {/if}
        </div>
      </Form>
    </div>
  {:else if activeContent === "DeleteAccount"}
    <div class="px-4 my-3">
      <p>
        <b>Are you sure you want to delete your account? All your progression will be lost.</b>
      </p>
      <div class="flex mt-5 gap-3">
        <Button
          onClick={() => {
            dispatch("deleteAccount"), (modalOpened = false);
          }}
          text="Delete"
          class="bg-transparent px-3 py-6 !border-aurora-red hover:bg-aurora-red" />
        <Button
          onClick={() => (modalOpened = false)}
          text="Cancel"
          class="bg-transparent px-3 py-6 !border-aurora-green hover:bg-aurora-green" />
      </div>
    </div>
  {:else if activeContent === "SingleReview"}
    <p>{singleReviewData.text}</p>
  {/if}
</Modal>

<div class="flex justify-center items-end h-full" style="padding-bottom: {screenHeight / 14.9}px">
  <div
    class="bg-night-1 flex rounded border-night-3 border-8"
    style="width: {screenWidth / 6}px; height: {screenHeight / 4.1}px">
    <div class="flex flex-col items-center justify-evenly w-12 bg-night-2 mr-2 rounded-r">
      <Button
        id="driversLicense"
        ariaLabel="Drivers license"
        class="w-6 h-6 !p-0 !shadow-transparent !rounded-none"
        onClick={() => dispatch("driverModal")}>
        <div slot="icon">
          <ClarityLicenseSolid class="text-aurora-orange text-{bgColor}" id="diverLicense" />
        </div>
      </Button>
      <Button
        id="info"
        ariaLabel="Information"
        onClick={toggleCheatSheet}
        class="w-6 h-6 !p-0 !shadow-transparent !rounded-none">
        <div slot="icon">
          <img src="multimedia/Info_Icon.png" alt="info" />
        </div>
      </Button>
      <Button
        id="dialog"
        ariaLabel="Toggle Dialog"
        onClick={dialog}
        class="w-6 h-6 !p-0 !shadow-transparent !rounded-none">
        <div slot="icon">
          <img
            src={dialogIconSrc}
            alt="dialog"
            class:cursor-not-allowed={dialogIconSrc === "multimedia/Dialogue_red_icon.png"} />
        </div>
      </Button>
    </div>
    <div class="flex flex-col w-full justify-center">
      <div class="flex gap-2 p-2">
        <Button
          id="achievements"
          ariaLabel="Achievements"
          onClick={() => forward("Achievements")}
          class="w-full h-full !p-0 !shadow-transparent">
          <div slot="icon">
            <img src="multimedia/Achievements_icon.png" alt="achievements" />
          </div>
        </Button>
        <Button
          id="rides"
          ariaLabel="Rides"
          onClick={() => forward("Rides")}
          class="w-full h-full !p-0 !shadow-transparent">
          <div slot="icon">
            <img src="multimedia/Contacts_icon.png" alt="contacts" />
          </div>
        </Button>
        <Button
          id="radio"
          ariaLabel="Radio"
          onClick={() => forward("Radio")}
          class="w-full h-full !p-0 !shadow-transparent">
          <div slot="icon">
            <img src="multimedia/Music_icon.png" alt="music" />
          </div>
        </Button>
      </div>
      <div class="flex gap-2 p-2">
        <Button
          id="journal"
          ariaLabel="Toggle journal"
          onClick={toggleJournal}
          class="w-full h-full !p-0 !shadow-transparent">
          <div slot="icon">
            {#if passage && reviewList.length != 0}
              <img src="multimedia/Notes_icon.png" alt="notes" />
            {:else}
              <img
                class="cursor-not-allowed hover:brightness-50 brightness-50"
                src="multimedia/Notes_icon.png"
                alt="notes" />
            {/if}
          </div>
        </Button>
        <Button
          id="reviews"
          ariaLabel="Reviews"
          class="w-full h-full !p-0 !shadow-transparent"
          onClick={() => forward("Reviews")}>
          <div slot="icon">
            <img src="multimedia/Reviews_icon.png" alt="reviews" />
          </div>
        </Button>
        <Button
          id="settings"
          ariaLabel="Settings"
          class="w-full h-full !p-0 !shadow-transparent"
          onClick={() => forward("Settings")}>
          <div slot="icon">
            <img src="multimedia/Settings_icon.png" alt="settings" />
          </div>
        </Button>
      </div>
    </div>
  </div>
</div>

<style>
  input[type="range"] {
    -webkit-appearance: none !important;
    appearance: none;
    background: #8fbcbb;
    height: 1em;
    width: 15em;
    border-radius: 99em;
  }

  input[type="range"]::-moz-range-thumb {
    background-color: #434c5e;
  }
</style>
