<template>
    <nav class="navigation text-gray-700 grid grid-flow-col items-center sm:grid-flow-row sm:align-middle sm:justify-start">
      
      <div class="navlink">
          <img class="navlink-icon" src="@/assets/Find.svg" alt="" srcset="">
          <span class="navlink-text">Find Vendor</span>
      </div> 
      <div class="navlink">
          <img class="navlink-icon" src="@/assets/Dashboard.svg" alt="" srcset="">
          <span class="navlink-text">Dashboard</span>
      </div> 
      <div class="navlink">
          <img class="navlink-icon" src="@/assets/Blog.svg" alt="" srcset="">
          <span class="navlink-text">Service Blog</span>
      </div> 
      <div class="navlink">
          <img class="navlink-icon" src="@/assets/Negotiations.svg" alt="" srcset="">
          <span class="navlink-text">Negotiations</span>
      </div> 
      
    </nav>

    
</template>

<script>

export default {
  name: "Nav",
  data() {
    return {
      links: [
        {
          id: 0,
          text: "Find Vendor",
          page: "/find",
          imgsrc: "@/assets/Vendor.svg"
        },
        {
          id: 1,
          text: "Dashboard",
          page: "/dashboard",
          imgsrc: "@/assets/Dashboard.svg"

        },
        {
          id: 2,
          text: "Portfolio",
          page: "/portfolio",
          imgsrc: "@/assets/Portfolio.svg"

        },
        {
          id: 3,
          text: "Blog",
          page: "/blog",
          imgsrc: "@/assets/Blog.png"

        },
        {
          id: 6,
          text: "Negotiations",
          page: "/negotiations",
          imgsrc: "@/assets/Negotiations.svg"
        }
      ]
    }
  }
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