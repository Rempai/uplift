<script lang="ts">
  import { radios } from "@/lib/radio";
  import type { PassageRead, ReviewRead, RideRead } from "@/lib/client";
  import { createEventDispatcher } from "svelte";
  import Modal from "./Modal.svelte";

  export let passage: PassageRead | null = null;
  export let reviewList: Array<ReviewRead>;
  export let riderList: Array<RideRead>;
  export let filledjournal: boolean;
  export let journal: boolean;

  let page: number;
  let dialogToggled = false;
  let activeContent: string;
  let modalHeader = "Menu";
  let modalOpened = false;
  let singleReviewData = {
    passenger: "",
    text: "",
  };
  let radioSelect: number;
  let buttonAccess = false;

  import IoIosCard from "~icons/ion/card-outline";
  import IoIosLocationOutline from "~icons/ion/location-outline";
  import IoIosStarOutline from "~icons/ion/star-outline";
  import TiTime from "~icons/typcn/time";
  import FaRoute from "~icons/fa6-solid/route";
  import IoIosCalendar from "~icons/ion/calendar";
  import IoIosPhonePortSharp from "~icons/ion/phone-portrait-sharp"; // not in use?
  import IonStar from "~icons/ion/star";
  import IonStarOutline from "~icons/ion/star-outline";
  import Button from "./Button.svelte";

  const dispatch = createEventDispatcher();

  const forward = (clickedPage: number, pressedItem: string, headerTitle?: string) => {
    checkAccess();
    if (buttonAccess) {
      page = clickedPage + 1;
      activeContent = pressedItem;
      modalHeader = headerTitle || pressedItem || "Menu";
      handleModal();
    }
  };

  const handleModal = () => {
    if (modalOpened === true) activeContent = null;
    journal = !journal;
    // modalHeader = "Menu"; // reset modal header to an empty string
    modalOpened = !modalOpened;
  };

  const showSingleReview = (review: ReviewRead) => {
    activeContent = "SingleReview";
    singleReviewData = {
      passenger: review.ride.passenger.name,
      text: review.description,
    };
    modalHeader = `${review.ride.passenger.name}'s review`; // set the modal header to the passenger name
  };

  const dialog = () => {
    if (passage !== null) {
      dispatch("dialog");
      dialogToggled = !dialogToggled;
    }
  };

  const quit = () => {
    dispatch("quitride");
  };

  const select = (data: RideRead) => {
    modalOpened = false;
    dispatch("select", data);
  };

  const toggleJournal = () => {
    if (buttonAccess) {
      dispatch("journalPressed");
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

  $: dialogIconSrc =
    passage && dialogToggled
      ? "multimedia/Dialogue_white_icon.png"
      : passage
      ? "multimedia/Dialogue_green_icon.png"
      : "multimedia/Dialogue_red_icon.png";

  const checkAccess = () => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken != null) {
      buttonAccess = true;
    }
  };
</script>

{#if radioSelect}
  <audio class="hidden" autoplay controls loop src={radios[radioSelect].source} />
{/if}

<Modal showModal={modalOpened} on:click={handleModal} {modalHeader}>
  {#if activeContent === "Achievements"}
    <div class="px-4 mt-3">
      <div class="flex justify-center flex-wrap gap-3">
        {#each Array(5) as _}
          <div
            class="text-xl py-4 px-2 cursor-pointer bg-aurora-red/40 hover:bg-aurora-red rounded border-dashed border-2 border-storm-3 w-20 h-20 flex justify-center items-center">
            <span class="text-2xl">?</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if activeContent === "Reviews"}
    <div class="px-4 mt-3">
      {#if reviewList.length}
        {#await reviewList then reviewer}
          {#each reviewer as data}
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
          {/each}
        {/await}
      {:else}
        <p class="text-center w-full">
          You have no reviews, please <span
            class="text-aurora-orange cursor-pointer"
            on:keypress
            on:click={() => {
              handleModal(), forward(0, "Contacts");
            }}>select a ride</span>
        </p>
      {/if}
    </div>
  {/if}
  {#if activeContent === "Contacts"}
    <div class="px-4 mt-2">
      <div class="profile pt-2 pb-2">
        {#if riderList?.length}
          {#if passage}
            <p class="text-center w-full">You are already in a ride.</p>
            {#if filledjournal && !journal}
              <div class="flex flex-col mb-3 mt-3">
                <Button onClick={quit} text="Quit ride" class="bg-aurora-red" />
              </div>
            {/if}
          {:else}
            {#await riderList then rider}
              {#each rider as data}
                <div>
                  <div
                    on:keypress
                    on:click={() => select(data)}
                    class="hover:bg-night-2 cursor-pointer rounded">
                    <div class="gap-3 w-full flex items-center">
                      <img class="rounded w-24 h-full" src={data.passenger.icon} alt="" />
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
                    <div class="flex items-center mt-1 gap-1 justify-center">
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
                  <div class="border-b-2 border-night-2 h-2 w-full mt-2" />
                </div>
              {/each}
            {/await}
          {/if}
        {:else}
          <p class="text-center w-full">There are no rides you can take.</p>
        {/if}
      </div>
    </div>
  {/if}
  {#if activeContent === "Radio"}
    <div class="px-4 mt-3 flex flex-col items-center">
      <select name="station" bind:value={radioSelect} class="my-5 p-3 bg-frost-4 rounded">
        {#each radios as radio}
          <option value={radio.id}>{radio.name}</option>
        {/each}
      </select>
      {#if radioSelect}
        <Button
          onClick={() => (radioSelect = 0)}
          text="Stop"
          class="!border-aurora-red hover:bg-aurora-red" />
      {/if}
    </div>
  {/if}
  {#if activeContent === "Settings"}
    <div class="px-4 mt-3">
      <p class="text-center text-3xl text-frost-1">Account</p>
      <div class="flex flex-col items-center gap-5 mt-6 mx-12">
        <Button
          onClick={() => dispatch("changeAccount", "username")}
          text="Username"
          class="bg-aurora-purple w-full" />
        <Button
          onClick={() => dispatch("changeAccount", "password")}
          text="Password"
          class="bg-aurora-orange w-full" />
        <Button onClick={() => dispatch("logout")} text="Logout" class="bg-aurora-green w-full" />
        <Button
          onClick={() => dispatch("changeAccount", "Delete")}
          text="Delete account"
          class="bg-aurora-red w-full" />
      </div>
    </div>
  {/if}
  {#if activeContent === "Notes"}
    {toggleJournal()}
  {/if}
  {#if activeContent === "SingleReview"}
    <p>{singleReviewData.text}</p>
  {/if}
</Modal>

<div
  class="bg-night-1 h-[8.68em] w-[13.1em] fixed z-10 bottom-[2.87em] left-1/2 transform -translate-x-1/2 rounded-md flex flex-row">
  <div
    class="flex flex-col items-center justify-evenly w-12 bg-white/10 mr-2"
    style="border-radius: 6px">
    <img
      src="multimedia/Home_icon.png"
      alt="info"
      class="w-6 h-6 cursor-pointer"
      on:click={() => forward(-1, "Home")}
      on:keydown />
    <img
      src="multimedia/Info_Icon.png"
      alt="info"
      class="w-6 h-6 cursor-pointer"
      on:click={() => forward(2, "Info")}
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
        on:click={() => forward(1, "Achievements")}
        on:keydown />
      <img
        src="multimedia/Contacts_icon.png"
        alt="contacts"
        class="w-full h-full cursor-pointer"
        on:click={() => forward(0, "Contacts")}
        on:keydown />
      <img
        src="multimedia/Music_icon.png"
        alt="music"
        class="w-full h-full cursor-pointer"
        on:click={() => forward(4, "Radio")}
        on:keydown />
    </div>
    <div class="flex gap-2 p-2">
      <img
        src="multimedia/Notes_icon.png"
        alt="notes"
        class="w-full h-full cursor-pointer"
        on:click={toggleJournal}
        on:keydown />
      <!-- drivers license hier? -->
      <img
        src="multimedia/Reviews_icon.png"
        alt="notes"
        class="w-full h-full cursor-pointer"
        on:click={() => forward(2, "Reviews")}
        on:keydown />
      <img
        src="multimedia/Settings_icon.png"
        alt="settings"
        class="w-full h-full cursor-pointer"
        on:click={() => forward(5, "Settings")}
        on:keydown />
    </div>
  </div>
</div>
