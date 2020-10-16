import Vue from "vue";
import VueRouter from "vue-router";
// import LandingPage from "../views/LandingPage.vue";
import Find from "../components/Finder.vue";
// import Home from "../views/Home.vue"
import Blog from "../components/Blog.vue";
import Negotiations from "../components/Negotiations.vue";



Vue.use(VueRouter);

var sessionActive = true;
var validUser;

const routes = [
  {
    path: "/",
    name: "Start",
    component: function() {

      if (!sessionActive) {

        console.log("land");

        return import(/* webpackChunkName: "" */ "../views/LandingPage.vue");
      }
      console.log("home");
      return import(/* webpackChunkName: "" */ "../views/Home.vue");

    },

    children: [
      {
        path: "/find",
        component: Find
      },
      {
        path: "/blog",
        component: Blog
      },
      {
        path: "/negotiations",
        component: Negotiations
      }

    ],

    beforeEnter: (to, from, next) => {
      // ...
      if (!sessionActive && validUser) next({ name: 'Registration' })
      else next()
    }
  },
  {
    path: "/register",
    name: "Registration",

    component: function() {
      return import(/* webpackChunkName: "" */ "../views/Registration.vue");
    }
  }
];

const router = new VueRouter({
  routes
});


export default router;
