<script lang="ts">
  import { push } from "svelte-spa-router";

  import Button from "@/components/Button.svelte";
  import Footer from "@/components/Footer.svelte";

  import Logo from "public/logo.png";
  import UpliftCar from "public/uplift-car.png";
  import UpliftMoney from "public/uplift-money.png";
  import UpliftTraining from "public/uplift-training.png";
  import UpliftBuitenkamer from "public/uplift-buitenkamer.png";
</script>

<header
  class="h-screen w-full bg-[url('/bg.png')] bg-cover bg-center text-center flex items-center">
  <div class="bg-night-2/80 rounded shadow p-4 md:p-10 w-9/12 md:w-4/12 mx-auto">
    <div class="flex flex-col justify-around items-center gap-4">
      <img class="w-4/12" src={Logo} alt="Logo" />
      <h1>Uplift</h1>
      <p class="text-frost-1">Getting you where you should be</p>
      <span on:keypress on:click={() => push("/game")}>
        <Button text="Start Uplift" class="md:!px-10" />
      </span>
      <Button href="#about-uplift" text="Read more" class="bg-aurora-orange md:!px-10" />
    </div>
  </div>
</header>
<section class="p-4 mx-auto max-w-screen-lg" id="about-uplift">
  <div class="md:flex md:justify-around md:items-center md:gap-20">
    <div class="pb-10">
      <h2>About Uplift</h2>
      <p>
        Uplift is a game set in the near future, one where the gig economy has kept expanding and
        taxi licensing has become impossibly complicated! So much so, that the only viable way for
        a ride-sharing service to exist, is to offer a complimentary service to get around
        licensing issues. In Uplift’s case, the service provided is one of psychological advice.
      </p>
    </div>
    <div>
      <img src={UpliftCar} alt="" class="w-screen" />
    </div>
  </div>
  <div class="md:flex md:justify-around md:items-center md:gap-20">
    <div class="pb-10 order-2">
      <h3>Your Job</h3>
      <p>
        Your task as an Uplift taxi driver is to pick up customers and bring them to their
        destination. Along the way, they will tell you about their problems. It is up to you to
        listen carefully and ask follow-up questions that reveal the underlying reasons for the
        problems they are experiencing. Fill out the Uplift Standard Report with these insights to
        help your customers and earn money!
      </p>
    </div>
    <div class="order-1">
      <img src={UpliftMoney} alt="" class="w-screen" />
    </div>
  </div>
</section>
<section class="p-4 mx-auto max-w-screen-lg">
  <div class="md:flex md:justify-around md:items-center md:gap-20">
    <div class="pb-10">
      <h3>Training</h3>
      <p>
        We understand that counseling might be new to you, and guiding customers through their
        process of introspection seems like an intimidating task. Luckily, Uplift will provide you
        with in-game coaches that can teach you everything you need to know. Our system of problem
        analysis is highly intuitive and you will learn to define and recognize such virtuous
        concepts as Bravery, Perseverance, Integrity and more!
      </p>
    </div>
    <div>
      <img src={UpliftTraining} alt="" class="w-screen" />
    </div>
  </div>
  <div class="flex justify-center my-10">
    <span on:keypress on:click={() => push("/game")}>
      <Button on:click={() => push("/game")} text="Start Now!" class="bg-aurora-orange !px-10" />
    </span>
  </div>
</section>
<section class="bg-night-3">
  <div class="p-4 mx-auto max-w-screen-lg md:flex md:justify-around md:items-center md:gap-20">
    <div class="pb-10 order-2">
      <h4>De Buitenkamer</h4>
      <p>
        Uplift is being designed as a student project at the behest of De Buitenkamer (<a
          href="https://buitenkamer.org">https://buitenkamer.org</a
        >). Who gave students at The Hague University of Applied Sciences the challenge to create a
        fun and innovative way to practice and learn ethical thinking and skills, as well as
        understanding of the concept of courage in general. The resulting game focuses on analysis
        of ethical problems and recognition of virtues and character skills as they have been
        developed in the field of Positive Psychology.
      </p>
    </div>
    <div class="order-1">
      <img src={UpliftBuitenkamer} alt="" class="rounded w-screen" />
    </div>
  </div>
</section>

<Footer />
