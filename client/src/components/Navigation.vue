<template>
  <div>
    <h2 class=""></h2>
    <nav class="mt-2 flex flex-col space-y-4">
      <router-link
        class="text-primary font-bold"
        v-for="routes in links"
        v-bind:key="routes.id"
        :to="`${routes.page}`"
        >{{ routes.text }}
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: "Navigation",
  data() {
    return {
      links: [
        {
          id: 0,
          text: "About",
          page: "/about"
        },
        {
          id: 1,
          text: "Contact",
          page: "/contact"
        },
        {
          id: 2,
          text: "Sign Up",
          page: "/register"
        }
      ],
      linksq: [
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
    };
  }
};
</script>
