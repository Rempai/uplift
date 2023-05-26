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
  import Form from "@/components/Form.svelte";
  import Notification from "@/components/Notification.svelte";
  import Modal from "@/components/Modal.svelte";
  import CustomMenu from "@/components/contextMenu/CustomMenu.svelte";
  import Journal from "@/components/Journal.svelte";
  import Resolution from "@/components/Resolution.svelte";
  import Achievement from "@/components/Achievement.svelte";
  import Progress from "@/components/Progress.svelte";
  import Multimedia from "@/components/Multimedia.svelte";
  import DriverModal from "@/components/DriverModal.svelte";

  import Background from "/background.webm";

  let messages: Array<string> = [];

  let rideList: Array<RideRead>;
  let reviewList: Array<ReviewRead>;

  let allPassages: Array<PassageRead>;
  let passedPassages: Array<string> = [];

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

  let login = false;
  let register = false;
  let welcome = false;

  let filledjournal = true;
  let patienceLost = false;
  let triggerAchievement = false;
  let tutorialCompleted = false;
  let unlockedAchievement = "";
  let allAchievements: Array<AchievementRead> = [];
  let unlockedAchievements = [];

  let ambientNoise = false;
  let animalease = true;
  let volumeAmbient = 1;
  let allowAudioCall = true;
  let audioAmbient;
  let audio;

  let modalOpened = false;
  let showReviewList = false;

  let showDriverModal = false;

  const submitLogin = async ({ target }) => {
    const login = await loginForAccessToken(target);
    if (login === true) {
      startGame();
    } else {
      $validation = $validation;
      showError(await validationErrorCheck(login, false));
    }
  };

  const submitRegister = async ({ target }) => {
    const register = await registerForAccessToken(target);
    if (register === true) {
      startGame();
    } else {
      $validation = $validation;
      showError(await validationErrorCheck(register, false));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    login = true;
    quitRide();
  };

  const startGame = async () => {
    $validation.length = 0;
    const token = localStorage.getItem("access_token");
    parsedJWT = await parseJwt(token);
    OpenAPI.TOKEN = token;

    login = false;
    register = false;

    await CharactersService.getRides()
      .then((res) => (rideList = res))
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

  const toggleAmbient = () => {
    ambientNoise = !ambientNoise;
  };

  const toggleAnimalease = () => {
    animalease = !animalease;
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

  const selectRide = async (event: CustomEvent) => {
    const ride: RideRead = event.detail;

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
    passedPassages.push(passage.passage);
    emotion.set(100);
  };

  const showError = (err: string) => {
    messages = [...messages, err];
  };

  const showResolution = ({ detail }) => {
    journal = false;
    resolution = true;
    resolutionData = detail;
  };

  const updateAccount = async ({ detail }) => {
    await updateUserAccount(detail, parsedJWT.sub).then((res) => {
      if (!res && res.status !== 200) {
        showError(res.statusText);
      } else {
        journal = false;
        modalOpened = false;
      }
    });
  };

  const deleteUser = async () => {
    UserService.deleteUser(parsedJWT.sub)
      .then(() => {
        localStorage.clear();
        showError("Deleted User");
        login = true;
      })
      .catch((err) => showError(err));
    pausevideo();
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
          journal = false;
          dialog = false;
          pausevideo();
        })
        .catch((err) => showError(err));
    }
    allowAudioCall = true;
  };

  const textParser = async (text: string) => {
    if (text) {
      if (text.match("{user}")) {
        text = text.replace("{user}", parsedJWT.username);
      }
    }
    return text;
  };

  const updateJournalData = async () => {
    // Workaround for adding {user} template parsing for the journal
    let dialogUpdate = passage;
    dialogUpdate.content = await textParsed;
    // Prevent duplicate passages in journal
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
    dialog = true;
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

    showReviewList = true;
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
    currentRide = undefined;
    ambientNoise = false;
    pausevideo();
    journalData = [];
    clearResolutionData();
    dialog = false;
    journal = false;
    filledjournal = true;
    patienceLost = false;
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
      rideList: rideList,
      resolutionData: resolutionData,
    });
    unlockedAchievement = allAchievements[achievementId - 1].name;
  };

  onMount(async () => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      startGame();
    } else {
      welcome = true;
    }
    if (!resolutionData) {
      clearResolutionData();
    }
  });

  $: if ($passageName !== "") {
    nextPassage($passageName);
  }

  $: if (passage) {
    if (allowAudioCall) {
      textParsed = textParser(passage.content);
      if (animalease && passage.speaker !== "You") {
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
            audio.volume = 0.5;
            audio.play();
          })
          .catch((error) => console.error(error));
      }
      updateJournalData();
    }
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
  <Resolution data={resolutionData} {currentRide} on:finishRide={finishRide} {resolution} />
  <Notification {messages} />
  <video
    class="fixed h-screen w-screen object-fill"
    loop
    muted
    autoplay={typeof passage === "object"}>
    <track kind="captions" />
    <source src={Background} />
  </video>
  {#if (dialog || journal) && !showDriverModal}
    <CustomMenu on:menuClick={updateContextData} />
  {/if}
  {#if reviewList}
    <DriverModal
      bind:showDriverModal
      lang="NL"
      username={parsedJWT.username}
      {allAchievements}
      {unlockedAchievements}
      {reviewList} />
  {/if}
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
    {#if welcome}
      <Modal showModal={true} modalHeader="" closeButton={false}>
        <div class="flex flex-col items-center gap-6">
          <p class="text-3xl">Welcome to</p>
          <img src="logo.png" alt="Logo" class="w-32" />
          <p class="text-frost-1 text-3xl mb-3">Uplift</p>
        </div>
        <div class="flex justify-center gap-4">
          <Button
            text="Login"
            class="bg-frost-1"
            onClick={() => {
              login = true;
              welcome = false;
            }} />
          <Button
            text="Register"
            class="bg-frost-3"
            onClick={() => {
              register = true;
              welcome = false;
            }} />
        </div>
      </Modal>
    {:else if login}
      <Modal showModal={true} modalHeader="Login" closeButton={false}>
        <Form
          backButton={true}
          on:back={() => {
            welcome = true;
            login = false;
          }}
          handleSubmit={submitLogin}
          login={true} />
      </Modal>
    {:else if register}
      <Modal showModal={true} modalHeader="Register" closeButton={false}>
        <Form
          backButton={true}
          on:back={() => {
            welcome = true;
            register = false;
          }}
          handleSubmit={submitRegister}
          register={true} />
      </Modal>
    {:else}
      {#if journal}
        <div
          in:fade
          class="mx-auto absolute left-0 right-0 top-16"
          style="border-radius: 50%">
          <Journal
            {journalData}
            {resolutionData}
            on:report={showResolution}
            on:gotoTab={gotoBranch} />
        </div>
      {/if}
      {#if dialog}
        <div in:fade class="absolute left-0 right-0 top-48 m-auto z-20">
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
        <Progress {allPassages} {passedPassages} />
      {/if}
      <Multimedia
        on:dialog={toggleDialog}
        on:select={selectRide}
        on:quitRide={quitRide}
        on:deleteAccount={deleteUser}
        on:logout={handleLogout}
        on:journalPressed={toggleJournal}
        on:updateAccount={updateAccount}
        on:toggleAmbient={toggleAmbient}
        on:toggleAnimalease={toggleAnimalease}
        on:driverModal={() => (showDriverModal = !showDriverModal)}
        {animalease}
        {showReviewList}
        {modalOpened}
        {passage}
        {reviewList}
        {rideList}
        {filledjournal}
        {journal}
        {allAchievements}
        {unlockedAchievements}
        {volumeAmbient}
        {audioAmbient}
        {ambientNoise} />
    {/if}
  </div>
</main>
