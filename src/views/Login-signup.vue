<template lang="">
  <div class="log-in-container">
    <div
      class="wrapper"
      :class="{ active: isActive }"
      :style="{ padding: padding }"
    >
      <div class="form-wrapper sign-in">
        <form>
          <h2>Login</h2>
          <div class="input-group-container">
            <div class="input-group mb-1">
              <input
                type="email"
                id="email"
                v-model="email"
                required
                placeholder=" "
              />
              <label for="email">Email </label>
            </div>
            <div class="label-info">ex: ayoubelb@gmail.com</div>
          </div>
          <div class="input-group-container">
            <div class="input-group mb-1">
              <input
                type="password"
                id="password"
                placeholder=" "
                v-model="password"
                pattern=".{8,}"
                title="Password must be at least 8 characters"
                required
              />
              <label for="password">Password </label>
            </div>
            <div class="label-info">ex: Ayoub123456/</div>
          </div>
          <button
            class="btn-login-register"
            type="submit"
            @click.prevent="logIn"
          >
            Login
          </button>
          <div class="signUp-link">
            <p>
              Don't have an account?
              <a href="#" class="signUpBtn-link" @click="isActive = true"
                >Sign Up</a
              >
            </p>
          </div>
        </form>
      </div>
      <div class="form-wrapper sign-up">
        <form action="">
          <h2>Sign Up</h2>
          <div class="input-group">
            <input type="text" v-model="username" placeholder=" " required />
            <label for="">Username</label>
          </div>
          <div class="input-group">
            <input type="email" v-model="email" placeholder=" " required />
            <label for="">Email</label>
          </div>
          <div class="input-group">
            <input
              type="password"
              v-model="password"
              placeholder=" "
              required
            />
            <label for="">Password</label>
          </div>
          <!-- <div class="remember">
            <label
              ><input type="checkbox" /> I agree to the terms &
              conditions</label
            >
          </div> -->
          <button
            class="btn-login-register"
            type="submit"
            @click.prevent="signUp"
          >
            Sign Up
          </button>
          <div class="signUp-link">
            <p>
              Already have an account?
              <a href="#" class="signInBtn-link" @click="isActive = false"
                >Sign In</a
              >
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import toastr from "toastr";
import axios from "axios";
const userStore = useUserStore();
const router = useRouter();
const username = ref("");
const email = ref();
const password = ref();
const isActive = ref(false);

const padding = computed(() => {
  return isActive.value ? "3.5rem 3rem" : "2.5rem 3rem";
});

const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-/]).{8,}/g;

const logIn = async () => {
  try {
    if (!email.value || !password.value) {
      toastr.error("All fields is required!", {
        positionClass: "toast-top-right",
      });
      return;
    }
    if (!emailRegEx.test(email.value)) {
      toastr.error("Please enter a valid email address!", {
        positionClass: "toast-top-right",
      });
      return;
    }
    if (!passwordRegEx.test(password.value)) {
      toastr.error(
        "At least 1 Uppercase , 1 Lowercase, 1 Number, 1 Symbol,Min 8 chars ",
        "Please enter a valid password!",
        {
          positionClass: "toast-top-right",
        }
      );
      return;
    }
    const res = await axios.post(`${userStore.API_URL}/users/login`, {
      email: email.value,
      password: password.value,
    });
    toastr.success("User is authenticated SuccessFully", "New Account", {
      positionClass: "toast-top-right",
    });
    await localStorage.setItem("jwt_info", JSON.stringify(res.data));
    router.push("/");
  } catch (error) {
    console.log(error);
  }
};

const signUp = async () => {
  try {
    if (!username.value || !email.value || !password.value) {
      toastr.error("All fields is required!", {
        positionClass: "toast-top-right",
      });
      return;
    }
    if (!emailRegEx.test(email.value)) {
      toastr.error("test@example.com", "Please enter a valid email address!", {
        positionClass: "toast-top-right",
      });
      return;
    }
    if (!passwordRegEx.test(password.value)) {
      toastr.error(
        "At least 1 Uppercase , 1 Lowercase, 1 Number, 1 Symbol,Min 8 chars ",
        "Please enter a valid password!",
        {
          positionClass: "toast-top-right",
        }
      );
      return;
    }
    const res = await axios.post(`${userStore.API_URL}/users/register`, {
      username: username.value,
      email: email.value,
      password: password.value,
    });

    toastr.success("Account is created successFully", "New Account", {
      positionClass: "toast-bottom-left",
    });

    username.value = "";
    email.value = "";
    password.value = "";
  } catch (error) {
    console.log(error);
  }
};
</script>

<style>
.log-in-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: -webkit-fill-available;
  background: #000;
}
.wrapper {
  position: relative;
  width: 400px;
  padding: 2.5rem 3rem;
  background: #000;
  box-shadow: 0 0 30px #0ef;
  border-radius: 20px;
  overflow: hidden;
}
.wrapper:hover {
  /* animation: animate 1s linear infinite; */
}
@keyframes animate {
  100% {
    filter: hue-rotate(360deg);
  }
}
.form-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 1rem 0;
  transition: transform 1s ease-in-out;
}
.form-wrapper form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.wrapper.active .form-wrapper.sign-in {
  transform: translateY(-450px);
}
.wrapper .form-wrapper.sign-up {
  position: absolute;
  top: 455px;
  left: 0;
}
.wrapper.active .form-wrapper.sign-up {
  transform: translateY(-450px);
}
h2 {
  font-size: 30px;
  color: #fff;
  text-align: center;
}
.input-group:has(:invalid) {
  --color: hsl(18 100% 50%);
  /* border-bottom: 2px solid hsl(18 100% 50%); */
}
.input-group:has(:focus) {
  --color: hsl(44 83% 53%);
  /* border-bottom: 2px solid hsl(44 83% 53%); */
}
.input-group:has(:valid) {
  --color: hsl(130 52% 46%);
  /* border-bottom: 2px solid hsl(130 52% 46%); */
}
.input-group:has(:placeholder-shown) {
  --color: #fff;
  /* border-bottom: 2px solid #fff; */
}
.input-group {
  position: relative;
  border-bottom: 2px solid var(--color);
}
.input-group label {
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  font-size: 1rem;
  color: var(--color);
  pointer-events: none;
  transition: 0.5s;
}
.input-group:has(:valid) label {
  display: inline-block;
}
@keyframes jump {
  50% {
    transform: translateY(-50%);
  }
}
.input-group:has(:invalid:not(:focus):not(:placeholder-shown)) {
  animation: shake 0.2s;
}
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(-2%);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(2%);
  }
}

.form-group:has(:placeholder-shown:not(:focus)) label {
  animation: none;
}
.input-group input {
  width: 290px;
  height: 40px;
  font-size: 1rem;
  color: #fff;
  padding: 0 5px;
  background: transparent;
  border: none;
  outline: none;
}
.input-group input:focus ~ label,
.input-group input:valid ~ label,
.input-group input:not(:placeholder-shown) ~ label {
  top: -5px;
}
.label-info {
  color: #6c757d;
}
.remember {
  margin: -5px 0 15px 5px;
}
.remember label {
  color: #fff;
  font-size: 14px;
}
.remember label input {
  accent-color: #0ef;
}
.btn-login-register {
  position: relative;
  width: 100%;
  height: 40px;
  background: #0ef;
  box-shadow: 0 0 10px #0ef;
  font-size: 16px;
  color: #000;
  font-weight: 500;
  cursor: pointer;
  border-radius: 30px;
  border: none;
  outline: none;
}
.signUp-link {
  font-size: 14px;
  text-align: center;
  margin: 15px 0;
}
.signUp-link p {
  color: #fff;
}
.signUp-link p a {
  color: #0ef;
  text-decoration: none;
  font-weight: 500;
}
.signUp-link p a:hover {
  text-decoration: underline;
}
@media screen and (max-device-width: 480px) {
  .wrapper {
    box-shadow: none;
  }
}
</style>
