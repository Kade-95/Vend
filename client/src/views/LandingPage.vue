
<template>
  <div class="LandingPage">
    <div id="nav" class="flex flex-row justify-between">
      <img class="logo ml- w-16" alt="Vue logo" src="@/assets/vend.svg" />
      <a @click="toggleNav" >
        <img class="logo ml- w-6" alt="nav" src="@/assets/menu.svg" />
      </a>
      
    </div>

    <Navigation 
      v-if="showNav"
        
    />

  </div>
</template>

<script>
import Navigation from "../components/Navigation.vue"

// @ is an alias to /src

export default {
  name: "LandingPage",
  components: {
    Navigation
  },
  data(){
    return {
      showNav: false
    }
  },
  methods: {
    toggleNav (){
      this.showNav = !this.showNav;
    }
  }
};
</script>
