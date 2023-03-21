<script lang="ts">
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  import { passage_name, validation } from "@/lib/stores";
  import { parseJwt, type jwtObject } from "@/lib/jwtParser";
  import { validateData, validationErrorCheck } from "@/lib/validation";

  import type { report, journalAnswer } from "@/main";

  import {
    AuthService,
    CharactersService,
    OpenAPI,
    PassageHandlingService,
    UserService,
    type PassageRead,
    type Register,
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

  let radios = [
    {
      id: 0,
      name: "Choose Radio",
    },
    {
      id: 1,
      name: "BBC",
      source: "https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one",
    },
    {
      id: 2,
      name: "SkyRadio",
      source: "https://25353.live.streamtheworld.com/SKYRADIO.mp3",
    },
    {
      id: 3,
      name: "ClassicFM",
      source: "https://jfm1.hostingradio.ru:14536/gcstream.mp3",
    },
    {
      id: 4,
      name: "Cool Song",
      source:
        "https://mp3.vevosongs.com/wp-content/uploads/2022/09/Rick_Astley_-_Never_Gonna_Give_You_Up.mp3",
    },
    {
      id: 5,
      name: "Crossroads Country Radio",
      source: "https://server-24.stream-server.nl/stream/CrossroadsCountryRadio/stream",
    },
    {
      id: 6,
      name: "Arabnights Radio",
      source: "http://arabnights-prod.live-streams.nl:8020/live",
    },
    {
      id: 7,
      name: "85.2 FM",
      source:
        "https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptitle=Still+alive+(Radio+loop)&filename=mt/MTE5NDI3NjUzMTE5NDQ4_dln0fNzdWkI.mp3",
    },
  ];
  let radio_select: number;
  let ambientNoise = false;

  let page: number;
  let showPhoneButton = true;

  let loader = true;

  let showModal = false;
  let modalHeader = "";
  let review_text = "";

  let welcome = false;
  let login = false;
  let register = false;

  let settingsPlane = "";

  // TODO: fix info and stuff (For notification colors)
  let notificationMessage = "";

  let rider_list: Array<RideRead>;
  let review_list: Array<ReviewRead>;

  let dialog = false;
  let passage: PassageRead;
  let text_parsed: Promise<string>;

  let journal = false;
  let journal_data: Array<PassageRead> = [];

  let context_data: journalAnswer = { marked_problem: "", marked_involved: "", marked_cause: "" };

  let resolution = false;
  let resolution_data: report;
  let solution: string;

  let current_ride: RideRead;

  let parsed_jwt: jwtObject;

  async function submitLogin({ target }) {
    const urlSearchParams = new URLSearchParams(new FormData(target) as any);

    await AuthService.login(urlSearchParams)
      .then((res) => {
        localStorage.setItem("access_token", res.access_token);
        localStorage.setItem("refresh_token", res.refresh_token);
        startGame();
      })
      .catch(async (err) => {
        showError(await validationErrorCheck(err, false));
        $validation = $validation;
      });
  }

  async function submitRegister({ target }) {
    const form_data = new FormData(target);
    const value = Object.fromEntries(form_data.entries());
    const register: Register = {
      username: value.username as string,
      password: value.password as string,
      repeat_password: value.repeat_password as string,
    };

    await validateData("Register", value as Register, true).then(async () => {
      await AuthService.register(register)
        .then((res) => {
          localStorage.setItem("access_token", res.access_token);
          localStorage.setItem("refresh_token", res.refresh_token);
          startGame();
        })
        .catch(async (err) => {
          if (err.body && err.body.message) {
            showError(err.body.message);
          } else {
            showError(await validationErrorCheck(err, false));
          }
          $validation = $validation;
        });
    });
  }

  const startGame = async () => {
    const token = localStorage.getItem("access_token");
    parsed_jwt = await parseJwt(token);
    OpenAPI.TOKEN = token;

    loader = false;
    login = false;
    register = false;
    showPhoneButton = false;
    page = 0;

    await CharactersService.getRides()
      .then((res) => (rider_list = res))
      .catch((err) => showError(err));

    await CharactersService.getReviews(parsed_jwt.sub)
      .then((res) => (review_list = res))
      .catch((err) => showError(err));
  };

  const phoneToggle = () => {
    showPhoneButton = !showPhoneButton;
  };

  const ambientToggle = () => {
    ambientNoise = !ambientNoise;
  };

  const journalToggle = () => {
    journal = !journal;
    dialog = false;
  };

  const dialogToggle = () => {
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
    review_text = review.description;
  };

  const selectRide = async (ride: RideRead) => {
    if (passage) {
      return;
    }

    await PassageHandlingService.getPassages(undefined, ride.passenger.id)
      .then((res) => (Array.isArray(res) ? ([passage] = res) : (passage = res)))
      .catch((err) => showError(err));

    current_ride = ride;
    dialog = true;
    showPhoneButton = true;
    ambientNoise = true;
    page = 0;
  };

  const showError = (err: string) => {
    if (!(err == "")) {
      notificationMessage += err + "\n";
    }
  };

  const showResolution = ({ detail }) => {
    journal = false;
    resolution = true;
    resolution_data = detail;
  };

  const changeAccount = async (settingsName: string) => {
    settingsPlane = settingsName;

    dialog = false;
    phoneToggle();
    journal = false;
  };

  const updateAccount = ({ target }) => {
    const form_data = new FormData(target);
    const value = Object.fromEntries(form_data.entries());

    UserService.updateUser(parsed_jwt.sub, value)
      .then(() => {
        settingsPlane = "";
        journal = false;
        phoneToggle();
      })
      .catch((err) => showError(err));
  };

  const deleteUser = async () => {
    UserService.deleteUser(parsed_jwt.sub)
      .then(() => {
        localStorage.clear();
      })
      .then(() => {
        notificationMessage += "Deleted User";
        showPhoneButton = false;
        welcome = true;
        settingsPlane = "";
      })
      .catch((err) => showError(err));
  };

  const nextPassageName = () => {
    let text = passage.passage_name;

    if (passage.speaker === "You" && !passage.branch_name.includes("FinishNow")) {
      text = text.replace("You", "");
    } else {
      let numbers = Number(text.match(/[0-9]*[0-9]$/g));
      numbers = numbers + 1;
      text = text.replace(/[0-9]*[0-9]$/g, "You" + numbers);
    }

    if (passage.branch_name.includes("FinishNow")) {
      createReview();
      dialogToggle();
    }

    nextPassage(text);
  };

  const nextPassage = (name: string) => {
    PassageHandlingService.getPassages(name)
      .then((res) => {
        // TODO: This should be done inside resolution probably.
        // Quick hack to get reviews working for the boys
        if (res.length === 0) {
          CharactersService.getReviews(parsed_jwt.sub)
            .then((res) => (review_list = res))
            .catch((err) => showError(err));
          passage = undefined;
          ambientNoise = false;
          const video = document.querySelector("video");
          video.pause();
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
    let dialog_update = passage;
    dialog_update.content = await text_parsed;
    //prevent duplicate passages in journal
    if (journal_data.length !== 0) {
      let alreadyInJournal = false;
      journal_data.forEach((obj) => {
        if (obj.id === dialog_update.id) {
          alreadyInJournal = true;
        }
      });
      if (!alreadyInJournal) {
        journal_data.push(dialog_update);
      }
    } else journal_data.push(dialog_update);
  };

  const updateContextData = async (event: CustomEvent) => {
    if (event.detail.type === "marked_problem") {
      context_data.marked_problem = event.detail.text;
    } else if (event.detail.type === "marked_involved") {
      context_data.marked_involved = event.detail.text;
    } else if (event.detail.type === "marked_cause") {
      context_data.marked_cause = event.detail.text;
    }
  };

  const gotoBranch = async (event: CustomEvent) => {
    journal = false;
    dialogToggle();
    nextPassage(event.detail.passage_name);
  };

  const finishRide = async (event: CustomEvent) => {
    solution = event.detail;
    nextPassage("Paolo" + solution + "You" + 1);
    resolution = false;
    dialog = true;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-BR", { dateStyle: "short", timeStyle: "short", hour12: false });
  };

  const createReview = async () => {
    const current_date = new Date();
    let current_time = current_date.toISOString();

    var reviewScore = Number(passage.branch_name.replace(/\D/g, ""));

    const input: ReviewedUserCreate = {
      userId: parsed_jwt.sub,
      reviewId: reviewScore,
      date: current_time,
    };

    await CharactersService.postReviewedUser(input).catch((err) => showError(err));

    await CharactersService.getReviews(null, parsed_jwt.sub).catch((err) => showError(err));

    page = 3;
    phoneToggle();
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

  $: if ($passage_name !== "") {
    nextPassage($passage_name);
  }

  $: if (passage) {
    text_parsed = textParser(passage.content);
    updateJournalData();
  }
</script>

<svelte:head>
  <title>Uplift | Game</title>
</svelte:head>

<main>
  {#if loader}
    <Loader />
  {/if}
  <CustomMenu on:menuClick={updateContextData} />
  <Resolution data={resolution_data} {current_ride} on:finishRide={finishRide} {resolution} />
  <Notification bind:message={notificationMessage} />
  <Modal {showModal} {modalHeader} on:click={() => (showModal = !showModal)}>
    <p class="mb-3">{review_text}</p>
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
  {#if radio_select}
    <audio class="hidden" autoplay controls loop src={radios[radio_select].source} />
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
                  phoneToggle();
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
                phoneToggle();
              }}>
              <div slot="forms">
                <input hidden required name="role" value={parsed_jwt.role} />
                {#if settingsPlane == "username"}
                  <label for="username">New Username</label>
                  <input required placeholder="test123" name="username" type="text" />
                {:else if settingsPlane == "password"}
                  <label for="old_password">Old password</label>
                  <input required placeholder="Old password" name="password" type="password" />
                  <label for="new_password">New password</label>
                  <input required placeholder="New password" name="new_password" type="password" />
                  <label for="confirm_password">Confirm password</label>
                  <input
                    required
                    placeholder="Confirm password"
                    name="confirm_password"
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
          {#await text_parsed then parsed_text}
            <Dialog
              on:next={nextPassageName}
              continue_button={dialog.continue_button}
              user={dialog.speaker}
              dialogColor={dialog.attribute.color}
              text={parsed_text}
              font={dialog.attribute.font_family}
              fontSize={dialog.attribute.font_size}
              color={dialog.attribute.color} />
          {/await}
        {/await}
      </div>
    {/if}
    {#if journal}
      <div in:fade class="w-9/12">
        <Journal
          {journal_data}
          {context_data}
          on:report={showResolution}
          on:gotoTab={gotoBranch} />
      </div>
    {/if}
    {#if showPhoneButton}
      <button
        class="w-16 h-20 absolute top-1/3 rounded-r flex justify-evenly items-center bg-aurora-red hover:brightness-110"
        on:click={phoneToggle}>
        <IoIosPhonePortSharp font-size="2.5em" class="text-night-3" />
      </button>
    {:else if login}
      <Phone on:close={phoneToggle} on:item={handleClick} menuName="Login">
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
      <Phone on:close={phoneToggle} on:item={handleClick} menuName="Register">
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
      <Phone on:close={phoneToggle} on:item={handleClick} menuName="Welcome">
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
        <Phone on:close={phoneToggle} on:item={handleClick} menuName="Choose Ride">
          <div slot="content" class="px-4 mt-3">
            <div class="profile">
              {#if rider_list.length}
                {#if passage}
                  <p class="text-center w-full">You are already in a ride.</p>
                {:else}
                  {#await rider_list then rider}
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
                              class="mr-2" />{data.from_location}
                          </p>
                          <p class="flex items-center">
                            <FaRoute font-size="1.2em" class="mr-2" />{data.to_location}
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
        <Phone on:close={phoneToggle} on:item={handleClick} menuName="Achievements">
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
        <Phone on:close={phoneToggle} on:item={handleClick} menuName="Reviews">
          <div slot="content" class="px-4 mt-3">
            {#if review_list.length}
              {#await review_list then reviewer}
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
        <Phone on:close={phoneToggle} on:item={handleClick} menuName="Dashboard">
          <div slot="content" class="px-4 mt-3 flex justify-around">
            <div class="flex flex-col items-center gap-5">
              {#if typeof passage == "object"}
                <Button onClick={dialogToggle} text="Toggle Dialog" class="bg-frost-1 w-full" />
                <Button onClick={journalToggle} text="Toggle Journal" class="bg-frost-2 w-full" />
                <Button
                  onClick={ambientToggle}
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
        <Phone on:close={phoneToggle} on:item={handleClick} menuName="Radio">
          <div slot="content" class="px-4 mt-3 flex flex-col items-center">
            <select name="station" bind:value={radio_select} class="my-5 p-3 bg-frost-4 rounded">
              {#each radios as radio}
                <option value={radio.id}>{radio.name}</option>
              {/each}
            </select>
            {#if radio_select}
              <Button
                onClick={() => (radio_select = 0)}
                text="Stop"
                class="bg-transparent border border-aurora-red hover:bg-aurora-red" />
            {/if}
          </div>
        </Phone>
      {:else if page == 6}
        <Phone on:close={phoneToggle} on:item={handleClick} menuName="Settings">
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
      <Phone on:close={phoneToggle} on:item={handleClick} />
    {/if}
  </div>
</main>
