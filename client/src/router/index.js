import Vue from "vue";
import VueRouter from "vue-router";
// import LandingPage from "../views/LandingPage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "LandingPage",
    component: function() {
      var notloggedIn = true;
      if (notloggedIn) {
        return import(/* webpackChunkName: "" */ "../views/LandingPage.vue");
      }
    }
  },
  {
    path: "/register",
    name: "Registration",

    component: function() {
      return import(/* webpackChunkName: "" */ "../views/Registration.vue");
    }
  },
  {
    path: "/home",
    name: "home",

    component: function() {
      return import(/* webpackChunkName: "" */ "../views/Home.vue");
    }
  },
  {
    path: "/test",
    name: "test",

    component: function() {
      return import(/* webpackChunkName: "" */ "../views/Registration.vue");
    }
  }
];

const router = new VueRouter({
  routes
});

export default router;
