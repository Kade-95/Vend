

<template>
  <div class="home">
    <div id="nav" class="flex flex-row justify-between">
    <img class="logo ml- w-16" alt="Vue logo" src="@/assets/vend.svg" />
    <img class="logo ml- w-6" alt="nav" src="@/assets/menu.svg" />

      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->
    </div>
    <registration />
  </div>
</template>

<script>
import registration from "../views/registration.vue"

// @ is an alias to /src

export default {
  name: "Home",
  components: {
    registration
  }
};
</script>
