import { createRouter, createWebHistory } from "vue-router";

// const jwt = localStorage.getItem("jwt_info");

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
  const jwt = JSON.parse(localStorage.getItem("jwt_info"));
  console.log("jwt: ", jwt);

  if (!jwt && to.name !== "LoginSignup") {
    console.log("test");
    next({ name: "LoginSignup" });
  } else if (jwt && to.name === "LoginSignup") {
    console.log("test2");
    next("/");
  } else {
    next();
  }
});

export default router;
