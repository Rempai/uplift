<script lang="ts">
  import { push } from "svelte-spa-router";

  import Button from "@/components/Button.svelte";
  import Footer from "@/components/Footer.svelte";
</script>

<section class="p-4 mx-auto max-w-screen-lg" id="about-uplift">
  <div class="md:flex md:justify-around md:items-center md:gap-20">
    <div class="pb-10">
      <h2>Knowledge Page</h2>
      <p>
        Uplift is a game set in the near future, one where the gig economy has kept expanding and
        taxi licensing has become impossibly complicated! So much so, that the only viable way for
        a ride-sharing service to exist, is to offer a complimentary service to get around
        licensing issues. In Uplift’s case, the service provided is one of psychological advice.
      </p>
    </div>
    <div>
      <img src="uplift-car.png" alt="" class="w-screen" />
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
      <img src="uplift-money.png" alt="" class="w-screen" />
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
      <img src="uplift-training.png" alt="" class="w-screen" />
    </div>
  </div>
  <div class="flex justify-center my-10">
    <Button onClick={() => push("/game")} text="Start Now!" class="bg-aurora-orange !px-10" />
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
      <img src="uplift-buitenkamer.png" alt="" class="rounded w-screen" />
    </div>
  </div>
</section>

<Footer />
