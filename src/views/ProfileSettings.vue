<template>
  <div class="profile-setting-container">
    <div class="log-out" v-if="windowWidth > 992">
      <button class="log-out-btn" @click="handleLogout">
        Log Out
        <i class="bi bi-box-arrow-in-down-right"></i>
      </button>
    </div>
    <div class="account">
      <div class="setting-sider">
        <div
          class="icon-container"
          data-bs-toggle="modal"
          data-bs-target="#ImageProfileModal"
          @mouseover="showPencil()"
          @mouseleave="hidePencil()"
        >
          <AdvancedImage
            :cldImg="userStore.profileImage"
            :alt="userStore.user.username"
            loading="lazy"
          />
          <!-- <img :src="userStore.profileImage" /> -->
          <div class="icon-content" v-if="editIcon">
            <i class="bi bi-pencil-fill"></i>
          </div>
        </div>
        <ImageProfileModal />
        <p>{{ userStore.user.username }}</p>
        <button
          class="log-out-btn"
          @click="handleLogout"
          v-if="windowWidth <= 992"
        >
          Log Out
          <i class="bi bi-box-arrow-in-down-right"></i>
        </button>
      </div>
      <div class="account-info">
        <div class="account-info-header">
          <div class="title">My Profile</div>
          <div class="close-profile-setting">
            <router-link to="/">
              <i class="bi bi-x-circle"></i>
            </router-link>
          </div>
        </div>
        <div
          class="account-info-item"
          v-for="(info, index) in accountInfo"
          :key="index"
        >
          <div class="account-info-text">
            <div class="account-info-title">{{ info.title }}</div>
            <div class="account-info-value">{{ info.value }}</div>
          </div>
          <div class="edit-add-info">
            <button
              type="button"
              data-bs-toggle="modal"
              :data-bs-target="dynamicModalTarget(info.id)"
            >
              {{ info.isEmpty ? "Add" : "Edit" }}
            </button>
          </div>
          <UserInfoModal :info="info" />
        </div>
        <hr />
        <div class="password-item">
          <div class="password-header-text">Password and Authentication</div>
          <div class="edit-password-btn">
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#changePassswordModal"
            >
              Change Password
            </button>
          </div>
          <ChangePasswordModal />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import UserInfoModal from "@/components/modals/UserInfoModal";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import ImageProfileModal from "@/components/modals/ImageProfileModal";
import { ref, reactive, watchEffect, onMounted, computed } from "vue";
import { AdvancedImage } from "@cloudinary/vue";

import toastr from "toastr";
import axios from "axios";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();

const editIcon = ref(false);
const username = ref(userStore.user.username);
const accountInfo = reactive([
  { id: 1, title: "username", value: userStore.user.username, isEmpty: false },
  { id: 2, title: "email", value: userStore.user.email, isEmpty: false },
  {
    id: 3,
    title: "phone number",
    value: "You haven't added a phone number yet.",
    isEmpty: true,
  },
]);

const windowWidth = ref();

onMounted(() => {
  console.log("userStore.user.username", userStore.user.username);
  windowWidth.value = window.innerWidth;
  window.addEventListener("resize", handleWindowSizeChange);
});

const handleWindowSizeChange = () => {
  windowWidth.value = window.innerWidth;
};

const dynamicModalTarget = (id) => {
  return `#userInfoModal${id}`;
};

const handleLogout = async () => {
  try {
    const res = await axios.get(
      `${userStore.API_URL}/users/signout/${userStore.user._id}`
    );
    toastr.info("User Signout", "See You Next Time", {
      positionClass: "toast-top-right",
    });
    localStorage.removeItem("jwt_info");
    // Redirect to login page after successful logout
    router.push("/login-signup");
    // this.$socket.disconnect();
    //     // this.$router.push("/login-signup");
  } catch (error) {
    console.log(error);
  }
};

const showPencil = () => {
  editIcon.value = true;
};
const hidePencil = () => {
  editIcon.value = false;
};

watchEffect(() => {
  username.value = accountInfo[0].value;
});
</script>
<style>
.profile-setting-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: #3a4042;
}
.log-out {
  margin: 1rem 2rem auto auto;
}
.log-out-btn {
  padding: 5px 8px;
  border-radius: 4px;
}
.account {
  /* width: max(45%, 600px); */
  display: flex;
  /* padding: 1rem; */
  margin-bottom: auto;
}
.setting-sider {
  display: flex;
  min-width: 150px;
  flex-direction: column;
  padding: 2rem 0;
  align-items: center;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  background-color: #1d1f25;
}
.icon-container {
  position: relative;
  margin-bottom: 6px;
}
.icon-container img {
  width: 5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}
.icon-container .icon-content {
  display: flex;
  height: 100%;
  width: 5rem;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: rgba(0, 0, 0, 0.2);
  transform: translate(-50%, -50%);
  font-size: 24px;
}
.icon-container .icon-content i {
  margin: auto;
}
.setting-sider p {
  font-size: 1.25rem;
  font-weight: 600;
}
.account-info {
  min-width: 500px;
  background-color: #282a30;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  padding: 2rem;
}
.account-info-item {
  display: flex;
  margin-bottom: 1rem;
}

.account-info-header,
.account {
  margin-inline: auto;
}
.account-info-header {
  display: flex;
  margin-bottom: 2rem;
}
.account-info-header .title {
  font-size: 1.25rem;
  font-weight: 600;
}
.close-profile-setting {
  margin-left: auto;
}
.close-profile-setting i {
  font-size: 32px;
  cursor: pointer;
  color: white;
}
.account-info-title {
  color: #d3d3d3;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 12px;
}
.edit-add-info {
  margin: auto 0 auto auto;
}
.edit-add-info button {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: 4px;
}
hr {
  margin: 2rem 0;
}
.password-header-text {
  color: #f0f0f0;
  font-weight: 600;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}
.edit-password-btn button {
  padding: 5px 14px;
  border-radius: 4px;
  border: #1b67d3 1px solid;
  background-color: #1b67d3;
  color: white;
  font-size: 14px;
}
.edit-password-btn button:hover {
  background-color: #1560bd;
}

/* Modal */
.modal-body {
  padding: 2rem;
}

.modal-body-title {
  text-transform: UPPERCASE;
  color: #d3d3d3;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 6px;
}
.modal-body input {
  width: 100%;
  border-radius: 3px;
  padding: 4px 8px;
  background-color: #282a30;
  color: #f0f0f0;
  border: 1px solid #282a30;
  margin-bottom: 1rem;
}
.modal-body input:last-child {
  margin-bottom: 0;
}
.modal-content button {
  border-radius: 4px;
  padding: 4px 14px;
}
@media screen and (max-device-width: 992px) {
  .profile-setting-container {
    padding: 2rem 0;
  }
  .log-out {
    margin: 0;
  }
  .log-out-btn {
    margin-left: auto;
  }
  .account {
    flex-direction: column;
    width: max(90%, 360px);
    gap: 1rem;
  }
  .setting-sider {
    flex-direction: row;
    gap: 12px;
    justify-content: start;
    padding: 1rem;
    border-radius: 6px;
  }
  .account-info {
    min-width: 360px;
    border-radius: 6px;
  }
}
</style>
