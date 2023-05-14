<script lang="ts">
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  import { passageName, validation, emotion } from "@/lib/stores";
  import { parseJwt, type jwtObject } from "@/lib/jwtParser";
  import { validationErrorCheck } from "@/lib/validation";
  import {
    loginForAccessToken,
    registerForAccessToken,
    updateUserAccount,
  } from "@/lib/authProcesses";
  import { isAchieved, IdUnlockedAchievements } from "@/lib/achievementsLogic";
  import {
    CharactersService,
    OpenAPI,
    PassageHandlingService,
    UserService,
    type PassageRead,
    type ReviewRead,
    type RideRead,
    type ReviewedUserCreate,
    type AchievementRead,
  } from "@/lib/client";

  import Dialog from "@/components/Dialog.svelte";
  import Button from "@/components/Button.svelte";
  import Phone from "@/components/Phone.svelte";
  import Form from "@/components/Form.svelte";
  import Notification from "@/components/Notification.svelte";
  import Modal from "@/components/Modal.svelte";
  import CustomMenu from "@/components/contextMenu/CustomMenu.svelte";
  import Journal from "@/components/Journal.svelte";
  import Loader from "@/components/Loader.svelte";
  import Resolution from "@/components/Resolution.svelte";
  import Achievement from "@/components/Achievement.svelte";
  import Progress from "@/components/Progress.svelte";
  import Multimedia from "@/components/Multimedia.svelte";

  import IoIosPhonePortSharp from "~icons/ion/phone-portrait-sharp";

  import Background from "/background.webm";
  import DriverModal from "@/components/DriverModal.svelte";

  let ambientNoise = false;

  let showPhoneButton = true;
  let phonebutton = true;

  let loader = true;

  let showModal = false;
  let modalHeader = "";
  let reviewText = "";

  let welcome = false;
  let login = false;
  let register = false;

  let errors: Array<string> = [];

  let riderList: Array<RideRead>;
  let reviewList: Array<ReviewRead>;

  let dialog = false;
  let passage: PassageRead;
  let textParsed: Promise<string>;

  let journal = false;
  let journalData: Array<PassageRead> = [];

  let currentRide: RideRead;

  let resolution = false;
  let resolutionData: RideRead;
  let solution: string;

  let parsedJWT: jwtObject;

  let filledjournal = true;

  let user;
  let allPassages: Array<PassageRead>;
  let passedPassages: Array<string> = [];
  let patienceLost = false;

  let triggerAchievement = false;
  let unlockedAchievement = "";

  let allAchievements: Array<AchievementRead> = [];
  let unlockedAchievements = [];

  let tutorialCompleted = false;
  let volumeAmbient = 1;
  let audioAmbient;
  let allowAudioCall = true;
  let audio;
  let modalOpened = false;

  const submitLogin = async ({ target }) => {
    const login = await loginForAccessToken(target);
    if (login === true) {
      checkPhoneButton();
      startGame();
    } else {
      $validation = $validation;
      showError(await validationErrorCheck(login, false));
    }
  };
  const submitRegister = async ({ target }) => {
    const register = await registerForAccessToken(target);
    if (register === true) {
      checkPhoneButton();
      startGame();
    } else {
      $validation = $validation;
      showError(await validationErrorCheck(register, false));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    pausevideo();
    checkPhoneButton();
    welcome = true;
    dialog = false;
    journal = false;
    togglePhone();
  };

  const startGame = async () => {
    showPhoneButton = true;
    const token = localStorage.getItem("access_token");
    parsedJWT = await parseJwt(token);
    OpenAPI.TOKEN = token;

    loader = false;
    login = false;
    register = false;

    await CharactersService.getRides()
      .then((res) => (riderList = res))
      .catch((err) => showError(err));

    await CharactersService.getReviews(parsedJWT.sub)
      .then((res) => (reviewList = res))
      .catch((err) => showError(err));

    await UserService.getAchievements()
      .then((res) => (allAchievements = res))
      .catch((err) => showError(err));

    await UserService.getAchievements(parsedJWT.sub)
      .then((res) => (unlockedAchievements = res))
      .catch((err) => showError(err));
  };

  const togglePhone = () => {
    showPhoneButton = !showPhoneButton;
  };

  const toggleAmbient = () => {
    ambientNoise = !ambientNoise;
  };

  const toggleJournal = () => {
    journal = !journal;
    dialog = false;
  };

  const toggleDialog = () => {
    dialog = !dialog;
    journal = false;
    allowAudioCall = dialog;
  };

  const skipAndLogin = () => {
    $validation.length = 0;
    welcome = !welcome;
    login = true;
  };

  const triggerRegister = () => {
    $validation.length = 0;
    welcome = !welcome;
    register = true;
  };

  const selectRide = async (event: CustomEvent) => {
    const ride: RideRead = event.detail;
    if (passage) {
      return;
    }

    await PassageHandlingService.getPassages(undefined, ride.id)
      .then((res) => (allPassages = res))
      .then((res) => (Array.isArray(res) ? ([passage] = res) : (passage = res)))
      .catch((err) => showError(err));

    currentRide = ride;
    dialog = true;
    ambientNoise = true;
    const video = document.querySelector("video");
    video.play();
    passedPassages = [];
    emotion.set(100);
  };

  const showError = (err: string) => {
    errors = [...errors, err];
  };

  const showResolution = ({ detail }) => {
    togglePhone();
    journal = false;
    resolution = true;
    resolutionData = detail;
  };

  const updateAccount = async ({ detail }) => {
    await updateUserAccount(detail, parsedJWT.sub)
      .then((res) => {
        if (!res && res.status !== 200) {
          showError(res.statusText);
        } else {
          journal = false;
          modalOpened = false;
        }
      })
  };

  const deleteUser = async () => {
    UserService.deleteUser(parsedJWT.sub)
      .then(() => {
        localStorage.clear();
      })
      .then(() => {
        showError("Deleted User");
        checkPhoneButton();
        welcome = true;
      })
      .catch((err) => showError(err));
    pausevideo();
    togglePhone();
  };

  const nextPassageName = () => {
    let text = passage.passage;
    if (passage.speaker === "You" && !passage.branch.includes("FinishNow")) {
      text = text.replace("You", "");
    } else {
      let numbers = Number(text.match(/[0-9]*[0-9]$/g));
      numbers = numbers + 1;
      text = text.replace(/[0-9]*[0-9]$/g, "You" + numbers);
    }

    if (passage.branch.includes("FinishNow")) {
      createReview();
      toggleDialog();
      journalData = [];
      filledjournal = true;
    }

    nextPassage(text);
  };

  const nextPassage = (name: string) => {
    passage = allPassages.find((p) => p.passage === name);

    if (passage && !passedPassages.includes(passage.passage)) {
      emotion.update((e) => e + passage.emotion);
      if (!passage.branch.includes("Finish") && !(passage.emotion < 0))
        passedPassages = [...passedPassages, passage.passage];
    }

    if (passage == undefined) {
      CharactersService.getReviews(parsedJWT.sub)
        .then((res) => {
          reviewList = res;
          passage = undefined;
          ambientNoise = false;
          pausevideo();
        })
        .catch((err) => showError(err));
    }
    allowAudioCall = true;
  };

  const textParser = async (text: string) => {
    if (text) {
      if (text.match("{user}")) {
        let user = await UserService.getMe();
        text = text.replace("{user}", user.username);
      }
    }
    return text;
  };

  const updateJournalData = async () => {
    // Workaround for adding {user} template parsing for the journal
    let dialogUpdate = passage;
    dialogUpdate.content = await textParsed;
    //prevent duplicate passages in journal
    if (journalData.length !== 0) {
      let alreadyInJournal = false;
      journalData.forEach((obj) => {
        if (obj.id === dialogUpdate.id) {
          alreadyInJournal = true;
        }
      });
      if (!alreadyInJournal) {
        journalData.push(dialogUpdate);
      }
    } else journalData.push(dialogUpdate);
  };

  const updateContextData = async (event: CustomEvent) => {
    if (event.detail.type === "mainProblem") {
      resolutionData.mainProblem = event.detail.text;
    } else if (event.detail.type === "partiesInvolved") {
      resolutionData.partiesInvolved = event.detail.text;
    } else if (event.detail.type === "mainCause") {
      resolutionData.mainCause = event.detail.text;
    }
  };

  const gotoBranch = async (event: CustomEvent) => {
    journal = false;
    toggleDialog();
    nextPassage(event.detail.passage);
  };

  const finishRide = async (event: CustomEvent) => {
    // Achievement: 4 stars on a Ride Paolo
    // if (reviewList[reviewList.length - 1].stars === 4) {
    // handleAchievement(4);
    // }

    // Achievement: 5 stars on a Ride Paolo
    // if (reviewList[reviewList.length - 1].stars === 5) {
    //   handleAchievement(5);
    // }

    // Achievement : Perfect journal for Ride Paolo
    handleAchievement(7);
    solution = event.detail;
    nextPassage(currentRide?.passenger.name + solution + "You" + 1);
    journalData = [];
    resolution = false;
    clearResolutionData();
    dialog = true;
    filledjournal = false;
    showPhoneButton = true;
  };

  const createReview = async () => {
    const currentDate = new Date();
    let currentTime = currentDate.toISOString();

    var reviewScore = patienceLost ? 6 : Number(passage.branch.replace(/\D/g, ""));

    const input: ReviewedUserCreate = {
      userId: parsedJWT.sub,
      reviewId: reviewScore,
      date: currentTime,
    };
    await CharactersService.postReviewedUser(input).catch((err) => showError(err));

    await CharactersService.getReviews(null, parsedJWT.sub).catch((err) => showError(err));

    // Achievement: Completed all rides
    //handleAchievement(9);

    //Achievement: Completed first ride
    if (reviewList.length === 1) {
      handleAchievement(1);
    }
    togglePhone();
    showPhoneButton = true;
  };

  const losePatience = () => {
    createReview();
    quitRide();
  };

  const clearResolutionData = () => {
    resolutionData = {
      ...resolutionData,
      mainCause: "",
      mainProblem: "",
      partiesInvolved: "",
    };
  };

  const quitRide = () => {
    passage = undefined;
    ambientNoise = false;
    pausevideo();
    journalData = [];
    clearResolutionData();
    dialog = false;
    journal = false;
    filledjournal = true;
    patienceLost = false;
    showPhoneButton = true;
  };

  const checkPhoneButton = () => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken != null) {
      phonebutton = false;
    } else {
      phonebutton = true;
    }
  };

  const pausevideo = () => {
    const video = document.querySelector("video");
    video.pause();
  };

  function handleAudioLoadedAmbient() {
    // eslint-disable-next-line  @typescript-eslint/no-this-alias
    audioAmbient = this;
  }

  const handleAchievement = (achievementId: number) => {
    // TODO: Achievement emotion meter: emotion stays above level whole game
    // TODO: Change license

    unlockedAchievements.forEach((item) => {
      if (!IdUnlockedAchievements.includes(item.achievementId)) {
        IdUnlockedAchievements.push(item.achievementId);
      }
    });

    triggerAchievement = isAchieved({
      userId: parsedJWT.sub,
      achievementId: achievementId,
      reviewList: reviewList,
      currentRide: currentRide,
      tutorialCompleted: tutorialCompleted,
      riderList: riderList,
      resolutionData: resolutionData,
    });
    unlockedAchievement = allAchievements[achievementId - 1].name;
  };

  onMount(async () => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      checkPhoneButton();
      startGame();
    } else {
      welcome = true;
    }
    if (!resolutionData) {
      clearResolutionData();
    }
  });

  $: if (passage) {
    if (allowAudioCall && passage.speaker !== "You") {
      textParsed = textParser(passage.content);
      fetch("https://audio.appelsapje.net/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          string: passage.content,
        }),
      })
        .then((response) => response.blob())
        .then((blob) => {
          allowAudioCall = false;
          if (audio) audio.pause();
          audio = new Audio();
          audio.src = URL.createObjectURL(blob);
          audio.playbackRate = 3.5;
          audio.volume = 0.3;
          audio.play();
        })
        .catch((error) => console.error(error));
      updateJournalData();
    }

    textParsed = textParser(passage.content);
    updateJournalData();
  }

  $: if ($passageName !== "") {
    nextPassage($passageName);
  }

  $: if ($emotion <= 70) {
    filledjournal = false;
    patienceLost = true;
  }
</script>

<svelte:head>
  <title>Uplift | Game</title>
</svelte:head>

<main>
  <Achievement triggered={triggerAchievement} achievementTitle={unlockedAchievement} />
  {#if parsedJWT}
    <button
      class="absolute z-10 bottom-0 right-3 border-black bg-slate-100 text-black px-4 py-3 border-t-4 border-r-4 border-l-4 rounded-t-lg"
      on:click={() => {
        showDriverModal = true;
      }}>
      Driver License
    </button>
  {/if}
  {#if reviewList}
    <DriverModal bind:showDriverModal username={user} {reviewList} />
  {/if}
  <Loader bind:loading={loader} />
  <CustomMenu on:menuClick={updateContextData} />
  <Resolution data={resolutionData} {currentRide} on:finishRide={finishRide} {resolution} />
  <Notification bind:message={errors} />
  <Modal {showModal} {modalHeader} on:click={() => (showModal = !showModal)} on:closed={() => (showModal = !showModal)}>
    <p class="mb-3">{reviewText}</p>
    <Button onClick={() => (showModal = !showModal)} text="close" class="bg-aurora-green w-fit" />
  </Modal>
  <video
    class="fixed h-screen w-screen object-fill"
    loop
    muted
    autoplay={typeof passage === "object"}>
    <track kind="captions" />
    <source src={Background} />
  </video>
  {#if ambientNoise}
    <audio
      class="hidden"
      autoplay
      controls
      loop
      src="ambient.mp3"
      on:loadedmetadata={handleAudioLoadedAmbient}
      volume={volumeAmbient} />
  {/if}
  <div
    class="h-screen relative bg-[url('/dashboard.png')] w-full bg-cover bg-center bg-no-repeat z-10"
    style="background-size: 100% 100%">
    {#if dialog}
      <div in:fade class="absolute left-0 right-0 top-1/3 m-auto z-20">
        {#await passage then dialog}
          {#await textParsed then parsedText}
            {#if !patienceLost}
              <Dialog
                on:next={nextPassageName}
                continueButton={dialog.continueButton}
                user={dialog.speaker}
                dialogColor={dialog.attribute.color}
                text={parsedText}
                font={dialog.attribute.fontFamily}
                fontSize={dialog.attribute.fontSize}
                color={dialog.attribute.color} />
            {:else}
              <Dialog
                on:next={losePatience}
                continueButton={true}
                text="You pissed off {currentRide.passenger
                  .name}! Whilst yelling at you, he exits the vehicle, and left a 0-star review..."
                dialogColor="#BF616A"
                color="#e5e9f0" />
            {/if}
          {/await}
        {/await}
      </div>
    {/if}
    {#if journal}
      <div in:fade class="w-9/12 z-30">
        <Journal
          {journalData}
          {resolutionData}
          on:report={showResolution}
          on:gotoTab={gotoBranch} />
      </div>
    {/if}
    {#if showPhoneButton}
      {#if phonebutton}
        <button
          class="w-16 h-20 absolute top-1/3 rounded-r flex justify-evenly items-center bg-aurora-red hover:brightness-110"
          on:click={togglePhone}>
          <IoIosPhonePortSharp font-size="2.5em" class="text-night-3" />
        </button>
      {/if}
    {:else if login}
      <Phone on:close={togglePhone} menuName="Login">
        <div slot="content" class="px-4 mt-3">
          <p class="text-center text-3xl text-frost-1">Login</p>
          <Form
            handleSubmit={submitLogin}
            enctype="multipart/form-data"
            login={true}
            backButton={true}
            on:back={() => {
              welcome = true;
              login = false;
            }} />
        </div>
      </Phone>
    {:else if register}
      <Phone on:close={togglePhone} menuName="Register">
        <div slot="content" class="px-4 mt-3">
          <p class="text-center text-3xl text-frost-1">Register</p>
          <Form
            handleSubmit={submitRegister}
            register={true}
            backButton={true}
            on:back={() => {
              welcome = true;
              register = false;
            }} />
        </div>
      </Phone>
    {:else if welcome}
      <Phone on:close={togglePhone} menuName="Welcome">
        <div slot="content" class="px-4 mt-3">
          <div class="flex flex-col items-center gap-6">
            <p class="text-3xl">Welcome to</p>
            <img src="logo.png" alt="Logo" class="w-32" />
            <p class="text-frost-1 text-3xl mb-3">Uplift</p>
          </div>
          <div class="gap-5 flex flex-col items-center mt-5">
            <Button onClick={triggerRegister} class="bg-frost-4" text="New player" />
            <Button onClick={skipAndLogin} class="bg-frost-1" text="Returning player" />
          </div>
        </div>
      </Phone>
    {:else if page}
      {#if page == 1}
        <Phone on:close={togglePhone} on:item={handleClick} menuName="Choose Ride">
          <div slot="content" class="px-4 mt-2">
            <div class="profile pt-2 pb-2">
              {#if riderList.length}
                {#if passage}
                  <p class="text-center w-full">You are already in a ride.</p>
                  {#if filledjournal && !journal}
                    <div class="flex flex-col mb-3 mt-3">
                      <Button onClick={quitRide} text="Quit ride" class="bg-aurora-red" />
                    </div>
                  {/if}
                {:else}
                  {#await riderList then rider}
                    {#each rider as data}
                      <div>
                        <div
                          on:keypress
                          on:click={() => selectRide(data)}
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
        </Phone>
      {:else if page == 2}
        <Phone on:close={togglePhone} on:item={handleClick} menuName="Achievements">
          <div slot="content" class="px-4 mt-3">
            <div class="flex justify-center flex-wrap gap-3">
              {#each Array(5) as _}
                <div
                  class="text-xl py-4 px-2 cursor-pointer bg-aurora-red/40 hover:bg-aurora-red rounded border-dashed border-2 border-storm-3 w-20 h-20 flex justify-center items-center">
                  <span class="text-2xl">?</span>
                </div>
              {/each}
            </div>
          </div>
        </Phone>
      {:else if page == 3}
        <Phone on:close={togglePhone} on:item={handleClick} menuName="Reviews">
          <div slot="content" class="px-4 mt-3">
            {#if reviewList.length}
              {#await reviewList then reviewer}
                {#each reviewer as data}
                  <div
                    class="mb-6 gap-3 w-full rounded flex items-center hover:bg-night-2 cursor-pointer"
                    on:keypress
                    on:click={() => toggleModal(data)}>
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
                      <p>{data.description}</p>
                    </div>
                  </div>
                {/each}
              {/await}
            {:else}
              <p class="text-center w-full">
                You have no reviews, please <span
                  class="text-aurora-orange cursor-pointer"
                  on:keypress
                  on:click={() => (page = 1)}>select a ride</span>
              </p>
            {/if}
          </div>
        </Phone>
      {:else if page == 4}
        <Phone on:close={togglePhone} on:item={handleClick} menuName="Dashboard">
          <div slot="content" class="px-4 mt-3 flex justify-around">
            <div class="flex flex-col items-center gap-5">
              {#if typeof passage == "object"}
                <Button onClick={toggleDialog} text="Toggle Dialog" class="bg-frost-1 w-full" />
                {#if filledjournal}
                  <Button
                    onClick={toggleJournal}
                    text="Toggle Journal"
                    class="bg-frost-2 w-full" />
                {/if}
                <Button
                  onClick={toggleAmbient}
                  text="Toggle Ambient Noise"
                  class="bg-frost-4 w-full" />
              {:else}
                <p class="text-center w-full">
                  Dashboard features are only enabled when you are in a ride.
                </p>
              {/if}
            </div>
          </div>
        </Phone>
      {:else if page == 5}
        <Phone on:close={togglePhone} on:item={handleClick} menuName="Radio">
          <div slot="content" class="px-4 mt-3 flex flex-col items-center">
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
        </Phone>
      {:else if page == 6}
        <Phone on:close={togglePhone} on:item={handleClick} menuName="Settings">
          <div slot="content" class="px-4 mt-3">
            <p class="text-center text-3xl text-frost-1">Account</p>
            <div class="flex flex-col items-center gap-5 mt-6 mx-12">
              <Button
                onClick={() => changeAccount("username")}
                text="Username"
                class="bg-aurora-purple w-full" />
              <Button
                onClick={() => changeAccount("password")}
                text="Password"
                class="bg-aurora-orange w-full" />
              <Button
                onClick={() => {
                  localStorage.clear();
                  parsedJWT = null;
                  showPhoneButton = false;
                  welcome = true;
                  dialog = false;
                  journal = false;
                  settingsPlane = "";
                }}
                text="Logout"
                class="bg-aurora-green w-full" />
              <Button
                onClick={() => changeAccount("Delete")}
                text="Delete account"
                class="bg-aurora-red w-full" />
            </div>
          </div>
        </Phone>
      {/if}
    {:else}
      <Phone on:close={togglePhone} />
    {/if}
    {#if dialog}
      <Progress {allPassages} {passedPassages} />
    {/if}
    <Multimedia
      on:dialog={toggleDialog}
      on:select={selectRide}
      on:quitride={quitRide}
      on:deleteAccount={deleteUser}
      on:logout={handleLogout}
      on:journalPressed={toggleJournal}
      on:updateAccount={updateAccount}
      on:toggleAmbient={toggleAmbient}
      {modalOpened}
      {passage}
      {reviewList}
      {riderList}
      {filledjournal}
      {journal}
      {volumeAmbient}
      {audioAmbient}
      {ambientNoise} />
  </div>
</main>
