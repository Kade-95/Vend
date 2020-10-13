<template>

  <div class="LandingPage align-center">
    <div
      id="nav"
      class=" max-w-screen-xl flex flex-row justify-between md:pl-10"
    >
      <img
        class="logo w-16 md:w-20 xl:w-24"
        alt="Vue logo"
        src="@/assets/vend.svg"
      />
      <a @click="toggleNav" class="lg:invisible">
        <img class="logo w-6 md:w-8" alt="nav" src="@/assets/menu.svg" />
      </a>
      
    </div>

    <Navigation v-if="showNav" />
  </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
// @ is an alias to /src

export default {
  name: "LandingPage",
  components: {
    Navigation
  },
  data() {
    return {
      showNav: false
    };
  },
  methods: {
    toggleNav() {
      this.showNav = !this.showNav;
    }
  }
};
</script>
