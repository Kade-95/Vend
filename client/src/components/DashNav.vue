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
          text: "Dashboard",
          page: "/"
        },
        {
          id: 1,
          text: "Portfolio",
          page: "/portfolio"
        },
        {
          id: 2,
          text: "Blog",
          page: "/blog"
        },
        {
          id: 3,
          text: "Notifications",
          page: "/notifications"
        },
        {
          id: 4,
          text: "Negotiations",
          page: "/negotiations"
        },
        {
          id: 5,
          text: "Settings",
          page: "/settings"
        }
      ]
    };
  }
};
</script>
