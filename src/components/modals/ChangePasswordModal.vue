<template>
  <div
    class="modal fade"
    id="changePassswordModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="changePassswordModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="changePassswordModalLabel">
            Update Your Password
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="password-input">
            <div class="modal-body-title">Current Password</div>
            <input
              :type="showPassword.currentPassword ? 'text' : 'password'"
              v-model="inputData.currentPassword"
            />
            <button
              @click="
                showPassword.currentPassword = !showPassword.currentPassword
              "
            >
              {{ showPassword.currentPassword ? "Hide" : "Show" }}
            </button>
          </div>
          <div class="password-input">
            <div class="modal-body-title">New Password</div>
            <input
              :type="showPassword.newPassword ? 'text' : 'password'"
              v-model="inputData.newPassword"
            />
            <button
              @click="showPassword.newPassword = !showPassword.newPassword"
            >
              {{ showPassword.newPassword ? "Hide" : "Show" }}
            </button>
          </div>
          <div class="password-input">
            <div class="modal-body-title">Confirm New Password</div>
            <input
              :type="showPassword.confirmPassword ? 'text' : 'password'"
              v-model="inputData.confirmPassword"
            />
            <button
              @click="
                showPassword.confirmPassword = !showPassword.confirmPassword
              "
            >
              {{ showPassword.confirmPassword ? "Hide" : "Show" }}
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="changePassword">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import axios from "axios";
import toastr from "toastr";
import { reactive, ref } from "vue";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const inputData = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const showPassword = reactive({
  currentPassword: false,
  newPassword: false,
  confirmPassword: false,
});

const changePassword = async () => {
  try {
    if (inputData.newPassword === inputData.confirmPassword) {
      const response = await axios.put(
        `${userStore.API_URL}/users/update-user-password/${userStore.user._id}`,
        {
          currentPassword: inputData.currentPassword,
          newPassword: inputData.newPassword,
        }
      );
      toastr.success(response.data.message, {
        positionClass: "toast-bottom-left",
      });
    } else {
      toastr.error("New password and confirm password do not match", {
        positionClass: "toast-bottom-left",
      });
    }
    (inputData.currentPassword = ""),
      (inputData.newPassword = ""),
      (inputData.confirmPassword = "");
  } catch (error) {
    toastr.error(error.response.data.error, "Server Error!", {
      positionClass: "toast-bottom-left",
    });
  }
};
</script>
<style>
.password-input {
  position: relative;
}
.password-input input {
  padding-right: 30px; /* Space for the button */
}

.password-input button {
  position: absolute;
  top: 55%;
  right: 5px;
  transform: translateY(-50%);
  background: none;
  color: #f0f0f0;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}
.password-input button:hover {
  color: #d3d3d3;
}
</style>
