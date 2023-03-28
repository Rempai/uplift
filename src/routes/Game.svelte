<script lang="ts">
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  import { passageName, validation } from "@/lib/stores";
  import { parseJwt, type jwtObject } from "@/lib/jwtParser";
  import { validationErrorCheck } from "@/lib/validation";
  import { radios } from "@/lib/radio";
  import {
    loginForAccessToken,
    registerForAccessToken,
    updateUserAccount,
  } from "@/lib/authProcesses";

  import {
    AuthService,
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

  import IoIosCard from "~icons/ion/card-outline";
  import IoIosLocationOutline from "~icons/ion/location-outline";
  import IoIosStarOutline from "~icons/ion/star-outline";
  import TiTime from "~icons/typcn/time";
  import FaRoute from "~icons/fa6-solid/route";
  import IoIosCalendar from "~icons/ion/calendar";
  import IoIosPhonePortSharp from "~icons/ion/phone-portrait-sharp";
  import IonStar from "~icons/ion/star";

  import Logo from "/logo.png";
  import Background from "/background.webm";
  import Ambient from "/ambient.mp3";

  let radioSelect: number;
  let ambientNoise = false;

  let page: number;
  let showPhoneButton = true;

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

  onMount(async () => {
    if (!resolutionData) {
      resolutionData = {
        ...resolutionData,
        mainCause: "",
        mainProblem: "",
        partiesInvolved: "",
      };
    }
  });

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

  const startGame = async () => {
    const token = localStorage.getItem("access_token");
    parsedJWT = await parseJwt(token);
    OpenAPI.TOKEN = token;

    loader = false;
    login = false;
    register = false;
    showPhoneButton = false;
    page = 0;

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
  };

  const handleClick = (event: CustomEvent) => {
    page = event.detail;
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

  const toggleModal = (review: ReviewRead) => {
    modalHeader = review.ride.passenger.name + "'s review";
    showModal = !showModal;
    reviewText = review.description;
  };

  const selectRide = async (ride: RideRead) => {
    if (passage) {
      return;
    }

    await PassageHandlingService.getPassages(undefined, ride.id)
      .then((res) => (Array.isArray(res) ? ([passage] = res) : (passage = res)))
      .catch((err) => showError(err));

    currentRide = ride;
    dialog = true;
    showPhoneButton = true;
    ambientNoise = true;
    page = 0;
  };

  const showError = (err: string) => {
    errors = [...errors, err];
  };

  const showResolution = ({ detail }) => {
    journal = false;
    resolution = true;
    resolutionData = detail;
  };

  const changeAccount = async (settingsName: string) => {
    settingsPlane = settingsName;

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
    }

    nextPassage(text);
  };

  const nextPassage = (name: string) => {
    PassageHandlingService.getPassages(name)
      .then((res) => {
        // TODO: This should be done inside resolution probably.
        // Quick hack to get reviews working for the boys
        if (res === undefined) {
          CharactersService.getReviews(parsedJWT.sub)
            .then((res) => {
              reviewList = res;
              passage = undefined;
              ambientNoise = false;
              const video = document.querySelector("video");
              video.pause();
            })
            .catch((err) => showError(err));
        } else {
          Array.isArray(res) ? ([passage] = res) : (passage = res);
        }
      })
      .catch((err) => showError(err));
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
    // TODO: this won't work for other rides
    nextPassage("Paolo" + solution + "You" + 1);
    resolution = false;
    dialog = true;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-BR", { dateStyle: "short", timeStyle: "short", hour12: false });
  };

  const createReview = async () => {
    const currentDate = new Date();
    let currentTime = currentDate.toISOString();

    var reviewScore = Number(passage.branch.replace(/\D/g, ""));

    const input: ReviewedUserCreate = {
      userId: parsedJWT.sub,
      reviewId: reviewScore,
      date: currentTime,
    };

    await CharactersService.postReviewedUser(input).catch((err) => showError(err));

    await CharactersService.getReviews(null, parsedJWT.sub).catch((err) => showError(err));

    page = 3;
    togglePhone();
    showPhoneButton = false;
  };

  onMount(() => {
    if (!localStorage.getItem("access_token")) {
      if (localStorage.getItem("refresh_token")) {
        AuthService.refresh()
          .then((res) => {
            localStorage.setItem("access_token", res.access_token);
            startGame();
          })
          .catch(() => (welcome = true));
      } else {
        showPhoneButton = false;
        welcome = true;
      }
    } else {
      UserService.getMe()
        .then(() => startGame())
        .catch(() => (welcome = true));
    }
  });

  $: if ($passageName !== "") {
    nextPassage($passageName);
  }

  $: if (passage) {
    textParsed = textParser(passage.content);
    updateJournalData();
  }
</script>

<svelte:head>
  <title>Uplift | Game</title>
</svelte:head>

<main>
  <Loader bind:loading={loader} />
  <CustomMenu on:menuClick={updateContextData} />
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
  {#if radioSelect}
    <audio class="hidden" autoplay controls loop src={radios[radioSelect].source} />
  {/if}
  {#if ambientNoise}
    <audio class="hidden" autoplay controls loop src={Ambient} />
  {/if}
  <div class="rounded h-screen relative bg-[url('/gamebg.png')] bg-repeat bg-cover bg-center">
    {#if settingsPlane}
      <div in:fade class="flex justify-center items-center absolute w-full h-full px-4">
        <div class="w-full max-w-screen-xl rounded bg-night-3 border-4 border-frost-3 z-5 p-6">
          {#if settingsPlane === "delete"}
            <p class="text-3xl text-frost-1">{settingsPlane}</p>
          {:else}
            <p class="text-3xl text-frost-1">Change {settingsPlane}</p>
          {/if}
          {#if settingsPlane == "delete"}
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
                  togglePhone();
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
                togglePhone();
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
            <Dialog
              on:next={nextPassageName}
              continueButton={dialog.continueButton}
              user={dialog.speaker}
              dialogColor={dialog.attribute.color}
              text={parsedText}
              font={dialog.attribute.fontFamily}
              fontSize={dialog.attribute.fontSize}
              color={dialog.attribute.color} />
          {/await}
        {/await}
      </div>
    {/if}
    {#if journal}
      <div in:fade class="w-9/12">
        <Journal
          {journalData}
          {resolutionData}
          on:report={showResolution}
          on:gotoTab={gotoBranch} />
      </div>
    {/if}
    {#if showPhoneButton}
      <button
        class="w-16 h-20 absolute top-1/3 rounded-r flex justify-evenly items-center bg-aurora-red hover:brightness-110"
        on:click={togglePhone}>
        <IoIosPhonePortSharp font-size="2.5em" class="text-night-3" />
      </button>
    {:else if login}
      <Phone on:close={togglePhone} on:item={handleClick} menuName="Login">
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
      <Phone on:close={togglePhone} on:item={handleClick} menuName="Register">
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
      <Phone on:close={togglePhone} on:item={handleClick} menuName="Welcome">
        <div slot="content" class="px-4 mt-3">
          <div class="flex flex-col items-center gap-6">
            <p class="text-3xl">Welcome to</p>
            <img src={Logo} alt="Logo" class="w-32" />
            <p class="text-frost-1 text-3xl mb-3">Uplift</p>
          </div>
          <div class="gap-5 flex flex-col items-center mt-5">
            <Button onClick={triggerRegister} class="bg-frost-4" text="Continue" />
            <Button onClick={skipAndLogin} class="bg-frost-1" text="Skip and login" />
          </div>
        </div>
      </Phone>
    {:else if page}
      {#if page == 1}
        <Phone on:close={togglePhone} on:item={handleClick} menuName="Choose Ride">
          <div slot="content" class="px-4 mt-3">
            <div class="profile">
              {#if riderList.length}
                {#if passage}
                  <p class="text-center w-full">You are already in a ride.</p>
                {:else}
                  {#await riderList then rider}
                    {#each rider as data}
                      <div
                        class="mb-6 gap-3 w-full rounded flex items-center hover:bg-night-2 cursor-pointer"
                        on:keypress
                        on:click={() => selectRide(data)}>
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
                        <span class="w-5 mr-2 text-frost-3"><IoIosCard font-size="1.2em" /></span>
                        {data.ride.passenger.name}
                      </p>
                      <p class="flex items-center">
                        <span class="w-5 mr-2 text-frost-3"
                          ><IoIosCalendar font-size="1.2em" /></span>
                        {formatDate(data.date)}
                      </p>
                      <div class="inline-flex items-center">
                        {#each Array(data.stars) as _}
                          <span class="w-5 mr-2 text-frost-3"><IonStar font-size="1.2em" /></span>
                        {/each}
                        {#if data.stars < 5}
                          {#each Array(5 - data.stars) as _}
                            <span class="w-5 mr-2 text-frost-3"
                              ><IoIosStarOutline font-size="1.2em" /></span>
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
                <Button onClick={toggleJournal} text="Toggle Journal" class="bg-frost-2 w-full" />
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
                class="bg-transparent border border-aurora-red hover:bg-aurora-red" />
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
                  showPhoneButton = false;
                  welcome = true;
                  dialog = false;
                  journal = false;
                  settingsPlane = "";
                }}
                text="Logout"
                class="bg-aurora-green w-full" />
              <Button
                onClick={() => changeAccount("delete")}
                text="Delete account"
                class="bg-aurora-red w-full" />
            </div>
          </div>
        </Phone>
      {/if}
    {:else}
      <Phone on:close={togglePhone} on:item={handleClick} />
    {/if}
  </div>
</main>
