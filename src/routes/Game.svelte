<script lang="ts">
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  import {
    passageName,
    validation,
    emotion,
    rendered,
    rideQuit,
    parsedJWT,
    errors,
  } from "@/lib/stores";
  import { parseJwt } from "@/lib/jwtParser";
  import {
    loginForAccessToken,
    registerForAccessToken,
    updateUserAccount,
  } from "@/lib/authProcesses";
  import { isAchieved } from "@/lib/achievementsLogic";

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
  import Modal from "@/components/Modal.svelte";
  import CustomMenu from "@/components/contextMenu/CustomMenu.svelte";
  import Journal from "@/components/Journal.svelte";
  import Resolution from "@/components/Resolution.svelte";
  import Achievement from "@/components/Achievement.svelte";
  import Progress from "@/components/Progress.svelte";
  import Multimedia from "@/components/Multimedia.svelte";
  import DriverModal from "@/components/DriverModal.svelte";
  import Arrow from "@/components/Arrow.svelte";
  import Error from "@/components/Error.svelte";

  import Background from "/background.webm";

  let rideList: Array<RideRead>;
  let reviewList: Array<ReviewRead>;

  let allPassages: Array<PassageRead>;
  let passedPassages: Array<string> = [];

  let dialog = false;
  let passage: PassageRead;

  let journal = false;
  let journalData: Array<PassageRead> = [];

  let currentRide: RideRead;

  let resolution = false;
  let resolutionData: RideRead;
  let solutionInput = "";

  let login = false;
  let register = false;
  let welcome = false;

  let filledjournal = true;
  let patienceLost = false;

  let triggerAchievement = false;
  let achievementCarousel = [];
  let allAchievements: Array<AchievementRead> = [];
  let unlockedAchievementsIds: Array<number> = [];
  let unlockedAchievements = [];

  let ambientNoise = false;
  let animalese = true;
  let volumeAmbient = 0.5;
  let allowAudioCall = true;
  let audioAmbient;
  let audio;

  let showReviewList = false;

  let showDriverModal = false;

  const submitLogin = async ({ target }) => {
    await loginForAccessToken(target)
      .then((response) => {
        if (response.access_token != null) {
          startGame();
        } else {
          ErrorMessage(response);
        }
      })
      .catch((err) => ErrorMessage(err));
  };

  const submitRegister = async ({ target }) => {
    await registerForAccessToken(target)
      .then((response) => {
        if (response.access_token != null) {
          startGame();
        } else {
          ErrorMessage(response);
        }
      })
      .catch((err) => {
        ErrorMessage(err);
      });
  };

  const ErrorMessage = (str: string) => {
    function isJsonString(str: string) {
      try {
        JSON.parse(str);
      } catch {
        return false;
      }
      return true;
    }

    if (typeof str === "object") {
      // @ts-ignore
      const res = Object.values(str)[3].message;

      if (isJsonString(res)) {
        const obj = JSON.parse(res);
        if (obj.length === 1) {
          showError(obj[0].message);
        } else if (obj.length > 1) {
          obj.forEach((element) => {
            showError(element.message);
          });
        }
      } else if (typeof res === "string") {
        showError(res);
      } else {
        showError(str);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    welcome = true;
    unlockedAchievements = [];
    unlockedAchievementsIds = [];
    quitRide();
  };

  const startGame = async () => {
    $validation.length = 0;
    const token = localStorage.getItem("access_token");
    $parsedJWT = await parseJwt(token);
    OpenAPI.TOKEN = token;

    await CharactersService.getRides()
      .then((res) => (rideList = res))
      .catch((err) => showError(err));

    await CharactersService.getReviews($parsedJWT.sub)
      .then((res) => (reviewList = res))
      .catch((err) => showError(err));

    await UserService.getAchievements()
      .then((res) => (allAchievements = res))
      .catch((err) => showError(err));

    await getUnlockedAchievements();

    if (register || reviewList.length === 0) {
      selectRide(new CustomEvent("", { detail: rideList.find((ride) => ride.id === 1) }));
    }

    login = false;
    register = false;
  };

  const toggleAmbient = () => {
    ambientNoise = !ambientNoise;
  };

  const toggleAnimalese = () => {
    animalese = !animalese;
  };

  const toggleJournal = () => {
    journal = !journal;
    journal ? (dialog = false) : (dialog = true);
  };

  const toggleDialog = () => {
    dialog = !dialog;
    journal = false;
    allowAudioCall = !allowAudioCall;
  };

  const selectRide = async (event: CustomEvent) => {
    $rideQuit = false;
    $rendered = false;
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
    const cleanedError = err.toString().replace(/^(ApiError|TypeError):\s*/, "");
    const id = Math.random();
    const newErr = { msg: cleanedError, id };
    errors.update((e) => [...e, newErr]);
  };

  const showResolution = ({ detail }) => {
    journal = false;
    resolution = true;
    resolutionData = detail;
  };

  const updateAccount = async ({ detail }) => {
    const res = await updateUserAccount(detail, $parsedJWT.sub);
    if (res.access_token) {
      localStorage.setItem("access_token", res.access_token);
      localStorage.setItem("refresh_token", res.refresh_token);
      OpenAPI.TOKEN = res.access_token;
      $parsedJWT = await parseJwt(res.access_token);
    } else {
      ErrorMessage(res);
    }
  };

  const deleteUser = async () => {
    await UserService.deleteUser($parsedJWT.sub)
      .then(() => {
        localStorage.clear();
        showError("Deleted User");
        welcome = true;
      })
      .catch((err) => showError(err));
    pausevideo();

    unlockedAchievements = [];
    unlockedAchievementsIds = [];
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
      if (passage.passage.includes("ScuffResolutionSkip")) {
        resolutionData.mainProblem = "bruh";
        resolutionData.partiesInvolved = "bruh";
        resolutionData.mainCause = "bruh";
        resolution = true;
        return;
      }
      createReview();
      toggleDialog();
      journalData = [];
      filledjournal = true;
    }
    nextPassage(text);
  };

  const nextPassage = (name: string) => {
    let passageFind = allPassages.find((p) => p.passage === name);

    if (passageFind) {
      if (passageFind.content.match("{user}")) {
        passageFind.content = passageFind.content.replace("{user}", $parsedJWT.username);
      }
    }

    if (passageFind && !passedPassages.includes(passageFind.passage)) {
      emotion.update((e) => e + passageFind.emotion);
      if (!passageFind.branch.includes("Finish") && !(passageFind.emotion < 0))
        passedPassages = [...passedPassages, passageFind.passage];
    }

    if (passageFind == undefined) {
      CharactersService.getReviews($parsedJWT.sub)
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

    passage = passageFind;
  };

  const updateJournalData = () => {
    // Workaround for adding {user} template parsing for the journal
    let dialogUpdate = passage;
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

  const updateContextData = (event: CustomEvent) => {
    if (event.detail.type === "mainProblem") {
      resolutionData.mainProblem = event.detail.text;
    } else if (event.detail.type === "partiesInvolved") {
      resolutionData.partiesInvolved = event.detail.text;
    } else if (event.detail.type === "mainCause") {
      resolutionData.mainCause = event.detail.text;
    }
  };

  const gotoBranch = (event: CustomEvent) => {
    journal = false;
    dialog = true;
    nextPassage(event.detail.passage);
  };

  const finishRide = async (event: CustomEvent) => {
    $rideQuit = true;
    $rendered = false;
    solutionInput = event.detail;
    nextPassage(currentRide.passenger.name + solutionInput + "You" + 1);
    journalData = [];
    resolution = false;
    clearResolutionData();
    dialog = true;
    filledjournal = false;
  };

  const createReview = async () => {
    const currentDate = new Date();
    let currentTime = currentDate.toISOString();

    let reviewScore: number;
    if (patienceLost) {
      let review = await CharactersService.getReviews().then((res) =>
        res.find((obj) => obj.rideId === currentRide.id && obj.stars === 0)
      );
      reviewScore = review.id;
    } else {
      reviewScore = await CharactersService.getReviews().then(
        (res) =>
          res.find((obj) => obj.rideId === currentRide.id && obj.solution === solutionInput).id
      );
    }

    const input: ReviewedUserCreate = {
      userId: $parsedJWT.sub,
      reviewId: reviewScore,
      date: currentTime,
    };

    await CharactersService.postReviewedUser(input).catch((err) => showError(err));

    await CharactersService.getReviews($parsedJWT.sub)
      .then((res) => {
        reviewList = res;
        showReviewList = true;
        if (!(reviewList === undefined || reviewList.length === 0)) {
          let lastReview = reviewList.at(-1);

          //Achievement: Completed first ride
          if (lastReview.description != "Finished tutorial") {
            handleAchievement(1);
          }

          // Achievement: 5 stars on Ride Paolo
          if (lastReview.stars === 5 && lastReview.ride.id === 2) {
            handleAchievement(10);
          }

          // Achievement: 4 stars on a Ride Paolo
          if (lastReview.stars === 4 && lastReview.ride.id === 2) {
            handleAchievement(4);
          }

          //Achievement: Tutorial complete
          if (lastReview.description === "Finished tutorial") {
            handleAchievement(6);
          }
        }
        // Achievement: Completed all rides
        // handleAchievement(9);
      })
      .catch((err) => showError(err));

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
    $rideQuit = true;
    $rendered = false;
    $passageName = "";
    currentRide = undefined;
    passage = undefined;
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

  const getUnlockedAchievements = async () => {
    await UserService.getAchievements($parsedJWT.sub)
      .then((res) => (unlockedAchievements = res))
      .catch((err) => showError(err));

    unlockedAchievements.forEach((item) => {
      if (!unlockedAchievementsIds.includes(item.achievementId)) {
        unlockedAchievementsIds.push(item.achievementId);
      }
    });
  };
  let achievement;
  const handleAchievement = async (achievementId: number) => {
    // TODO: Achievement emotion meter: emotion stays above level whole game
    achievement = await isAchieved({
      userId: $parsedJWT.sub,
      unlockedAchievementsIds: unlockedAchievementsIds,
      achievementId: achievementId,
      reviewList: reviewList,
      currentRide: currentRide,
      rideList: rideList,
      resolutionData: resolutionData,
    });

    if (achievement) {
      await getUnlockedAchievements();
      triggerAchievement = true;
      achievementCarousel.push(allAchievements[achievementId - 1].name);
    }
  };

  const toggleReview = () => {
    if (passage === undefined) {
      $rideQuit = true;
    }
    showReviewList = false;
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
      if (audio) audio.pause();
      let processedText = passage.content.replace(/<i>[\s\S]*?<\/i>/g, "").replace(/<[^>]+>/g, "");
      if (animalese && passage.speaker !== "You") {
        fetch("https://audio.appelsapje.net/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            string: processedText,
          }),
        })
          .then((response) => response.blob())
          .then((blob) => {
            allowAudioCall = false;
            audio = new Audio();
            audio.src = URL.createObjectURL(blob);
            audio.playbackRate = 3.5;
            audio.volume = 0.2;
            audio.play();
          })
          .catch((error) => console.error(error));
      }
      updateJournalData();
    }
  }

  $: if ($emotion === 0) {
    filledjournal = false;
    patienceLost = true;
  }
</script>

<svelte:head>
  <title>Uplift | Game</title>
</svelte:head>

<main>
  {#await reviewList then _}
    {#if triggerAchievement}
      <Achievement
        on:killAchievement={() => {
          triggerAchievement = false;
          achievementCarousel = [];
        }}
        {achievementCarousel}
        {triggerAchievement} />
    {/if}
  {/await}
  <Resolution
    data={resolutionData}
    {currentRide}
    on:finishRide={finishRide}
    {resolution}
    on:achievement={(event) => handleAchievement(event.detail.achievementId)} />
  <div class="absolute right-0 w-full max-h-full overflow-hidden flex flex-col">
    {#each $errors as error}
      <Error message={error.msg} id={error.id} />
    {/each}
  </div>
  <video
    class="fixed h-screen w-screen object-cover overflow-hidden"
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
      on:achievement={(event) => handleAchievement(event.detail.achievementId)}
      lang="NL"
      username={$parsedJWT.username}
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
          class="mx-auto absolute left-0 right-0 top-16 h-[50%]"
          style="border-radius: 50%">
          <Journal
            {journalData}
            {resolutionData}
            {currentRide}
            on:report={showResolution}
            on:closed={toggleJournal}
            on:gotoTab={gotoBranch} />
        </div>
      {/if}
      {#if dialog}
        <div in:fade class="absolute right-0 left-0 top-16 lg:top-48 m-auto z-20 px-4">
          {#if passage}
            {#if !patienceLost}
              <Dialog
                on:next={nextPassageName}
                continueButton={passage.continueButton}
                user={passage.speaker}
                text={passage.content}
                font={passage.attribute.fontFamily}
                fontSize={passage.attribute.fontSize}
                color={passage.attribute.color} />
            {:else}
              <Dialog
                on:next={createReview}
                continueButton={true}
                text="You pissed off {currentRide.passenger
                  .name}! Whilst yelling at you, he exits the vehicle, and left a 0-star review..."
                color="#e5e9f0" />
            {/if}
          {/if}
        </div>
        <Progress passenger={currentRide.passenger.name} {allPassages} {passedPassages} />
        {#if currentRide.passenger.name == "Arty"}
          <Arrow {passage} />
        {/if}
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
        on:toggleAnimalese={toggleAnimalese}
        on:toggleReview={toggleReview}
        on:driverModal={() => (showDriverModal = !showDriverModal)}
        on:achievement={(event) => handleAchievement(event.detail.achievementId)}
        modalOpened={false}
        {animalese}
        {showReviewList}
        {passage}
        {reviewList}
        {rideList}
        {filledjournal}
        {journal}
        {allAchievements}
        {unlockedAchievementsIds}
        {volumeAmbient}
        {audioAmbient}
        {ambientNoise} />
    {/if}
  </div>
</main>
