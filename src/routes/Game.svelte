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

  import {
    CharactersService,
    OpenAPI,
    PassageHandlingService,
    UserService,
    type PassageRead,
    type ReviewRead,
    type RideRead,
    type ReviewedUserCreate,
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
  import Multimedia from "@/components/Multimedia.svelte";

  import IoIosPhonePortSharp from "~icons/ion/phone-portrait-sharp";

  import Background from "/background.webm";

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

  let settingsPlane = "";

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

  let allPassages: Array<PassageRead>;
  let passedPassages: Array<string> = [];

  let patienceLost = false;

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
      startGame();
    } else {
      $validation = $validation;
      showError(await validationErrorCheck(register, false));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    showPhoneButton = false;
    welcome = true;
    dialog = false;
    journal = false;
    settingsPlane = "";
  };

  const startGame = async () => {
    const token = localStorage.getItem("access_token");
    parsedJWT = await parseJwt(token);
    OpenAPI.TOKEN = token;

    loader = false;
    login = false;
    register = false;
    showPhoneButton = false;
    //page = 0;

    await CharactersService.getRides()
      .then((res) => (riderList = res))
      .catch((err) => showError(err));

    await CharactersService.getReviews(parsedJWT.sub)
      .then((res) => (reviewList = res))
      .catch((err) => showError(err));
  };

  const togglePhone = () => {
    showPhoneButton = !showPhoneButton;
  };

  const toggleJournal = () => {
    journal = !journal;
    dialog = false;
  };

  const toggleDialog = () => {
    dialog = !dialog;
    journal = false;
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
    showPhoneButton = true;
    ambientNoise = true;
    const video = document.querySelector("video");
    video.play();
    // page = 0;
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

  const changeAccount = async (event: CustomEvent) => {
    settingsPlane = event.detail;
    dialog = false;
    togglePhone();
    journal = false;
  };

  const updateAccount = async ({ target }) => {
    const update = await updateUserAccount(target, parsedJWT.sub);
    if (update === true) {
      settingsPlane = "";
      journal = false;
      togglePhone();
    } else {
      showError(update);
    }
  };

  const deleteUser = async () => {
    UserService.deleteUser(parsedJWT.sub)
      .then(() => {
        localStorage.clear();
      })
      .then(() => {
        showError("Deleted User");
        showPhoneButton = false;
        welcome = true;
        settingsPlane = "";
      })
      .catch((err) => showError(err));
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
      passedPassages = [...passedPassages, passage.passage];
    }

    if (passage == undefined) {
      CharactersService.getReviews(parsedJWT.sub)
        .then((res) => {
          reviewList = res;
          passage = undefined;
          ambientNoise = false;
          const video = document.querySelector("video");
          video.pause();
        })
        .catch((err) => showError(err));
    }
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

    // page = 3;
    togglePhone();
    showPhoneButton = false;
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

  $: if ($passageName !== "") {
    nextPassage($passageName);
  }

  $: if ($emotion <= 70) {
    filledjournal = false;
    patienceLost = true;
  }

  $: if (passage) {
    textParsed = textParser(passage.content);
    updateJournalData();
  }

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
    const video = document.querySelector("video");
    video.pause();
    journalData = [];
    clearResolutionData();
    dialog = false;
    filledjournal = true;
    // page = 0;
    patienceLost = false;
  };

  const checkPhoneButton = () => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken != null) {
      phonebutton = false;
    } else {
      phonebutton = true;
    }
  };
</script>

<svelte:head>
  <title>Uplift | Game</title>
</svelte:head>

<main>
  <Loader bind:loading={loader} />
  <CustomMenu on:menuClick={updateContextData} />
  <Multimedia
    on:dialog={toggleDialog}
    on:select={selectRide}
    on:quitride={quitRide}
    on:changeAccount={changeAccount}
    on:logout={handleLogout}
    on:journalPressed={toggleJournal}
    {passage}
    {reviewList}
    {riderList}
    {filledjournal}
    {journal} />
  <Resolution data={resolutionData} {currentRide} on:finishRide={finishRide} {resolution} />
  <Notification bind:message={errors} />
  <Modal {showModal} {modalHeader} on:click={() => (showModal = !showModal)}>
    <p class="mb-3">{reviewText}</p>
    <Button onClick={() => (showModal = !showModal)} text="close" class="bg-aurora-green w-fit" />
  </Modal>
  <video
    class="fixed h-screen w-screen object-fill rounded"
    loop
    muted
    autoplay={typeof passage === "object"}>
    <track kind="captions" />
    <source src={Background} />
  </video>
  {#if ambientNoise}
    <audio class="hidden" autoplay controls loop src="ambient.mp3" />
  {/if}
  <div class="rounded h-screen relative bg-[url('/dashboard.png')] bg-repeat bg-cover bg-center">
    {#if settingsPlane}
      <div in:fade class="flex justify-center items-center absolute w-full h-full px-4">
        <div
          class="w-full max-w-screen-xl rounded bg-night-3 border-4 border-frost-3 z-5 p-6 z-20">
          {#if settingsPlane === "Delete"}
            <p class="text-3xl text-frost-1">{settingsPlane} account</p>
          {:else}
            <p class="text-3xl text-frost-1">Change {settingsPlane}</p>
          {/if}
          {#if settingsPlane == "Delete"}
            <p>
              <b>Are you sure you want to delete your account? All progression will be lost.</b>
            </p>
            <div class="flex justify-center mt-5 gap-3">
              <Button
                onClick={deleteUser}
                text="Delete"
                class="bg-transparent px-3 py-6 !border-aurora-red hover:bg-aurora-red" />
              <Button
                onClick={() => {
                  if (showPhoneButton === true) togglePhone();
                  settingsPlane = "";
                }}
                text="Cancel"
                class="bg-transparent px-3 py-6 !border-aurora-green hover:bg-aurora-green" />
            </div>
          {:else}
            <Form
              handleSubmit={updateAccount}
              backButton={true}
              on:back={() => {
                settingsPlane = "";
                if (showPhoneButton === true) togglePhone();
              }}>
              <div slot="forms">
                <input hidden required name="role" value={parsedJWT.role} />
                {#if settingsPlane == "username"}
                  <label for="username">New Username</label>
                  <input required placeholder="test123" name="username" type="text" />
                {:else if settingsPlane == "password"}
                  <label for="password">Password</label>
                  <input required placeholder="password" name="password" type="password" />
                  <label for="newPassword">New password</label>
                  <input required placeholder="New password" name="newPassword" type="password" />
                  <label for="repeatPassword">Confirm password</label>
                  <input
                    required
                    placeholder="Confirm password"
                    name="repeatPassword"
                    type="password" />
                {/if}
              </div>
            </Form>
          {/if}
        </div>
      </div>
    {/if}
    {#if dialog}
      <div in:fade class="absolute left-0 right-0 top-1/3 m-auto">
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
              <!-- dialogColor = aurora red, color = Nord's snow color. -->
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
    {:else}
      <Phone on:close={togglePhone} />
    {/if}
  </div>
</main>
