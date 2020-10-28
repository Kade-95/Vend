<template>
    <nav class="navigation text-gray-700 grid grid-flow-col items-center sm:grid-flow-row sm:align-middle sm:justify-start">
      <router-link to="/" class="navlink">
          <img class="navlink-icon" src="@/assets/Dashboard.svg" alt="" srcset="">
          <span class="navlink-text">Home</span>
      </router-link>

      <router-link to="/find" class="navlink">
          <img class="navlink-icon" src="@/assets/Find.svg" alt="" srcset="">
          <span class="navlink-text">Find Vendor</span>
      </router-link>

      <router-link to="/blog" class="navlink">
          <img class="navlink-icon" src="@/assets/Blog.svg" alt="" srcset="">
          <span class="navlink-text">Blog</span>
      </router-link>

      <router-link to="/negotiations" class="navlink">
          <img class="navlink-icon" src="@/assets/Negotiations.svg" alt="" srcset="">
          <span class="navlink-text">Negotiations</span>
      </router-link> 
      
    </nav>

    
</template>

<script>

export default {
  name: "Nav"
};
</script>

<style scoped>

.navigation{
  grid-area: nav;
  gap: 2em;
}
    
</style>

<style scoped>

.navlink
{
  @apply whitespace-no-wrap text-left grid justify-center;    
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: #333333;
  justify-items: center;

}

@media (min-width: 640px) 
{
  .navlink{
    grid-template-columns: max-content 1fr;
    gap: 1em;
    justify-content:flex-start;
    justify-items: normal;

  }
}

.navlink-text
{
  text-align: left;
  align-self: center;
}

.navlink-icon
{
  width: 1rem;
}

</style>