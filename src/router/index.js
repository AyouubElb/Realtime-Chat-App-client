import { createRouter, createWebHistory } from "vue-router";

const jwt = localStorage.getItem("jwt_info");

const routes = [
  {
    path: "/",
    name: "ChatPage",
    component: () => import(/* webpackChunkName: "Chat"*/ "@/views/Chat"),
  },
  {
    path: "/login-signup",
    name: "LoginSignup",
    component: () =>
      import(/* webpackChunkName: "LoginSignup"*/ "@/views/Login-signup.vue"),
  },
  {
    path: "/profile-settings",
    name: "profile-settings",
    component: () =>
      import(
        /* webpackChunkName: "ProfileSettings"*/ "@/views/ProfileSettings.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (!jwt && to.name !== "LoginSignup") {
    next({ name: "LoginSignup" });
  } else {
    next();
  }
});

export default router;
