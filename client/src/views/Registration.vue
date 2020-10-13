<template>
  <div
    class="mt-12 pt-16 pb-16 bg-white flex flex-col self-center items-center max-w-xl m-auto sm:vshadow"
  >
    <img class="logo w-24" alt="logo" src="@/assets/vend.svg" />
    <span class="bg-green mt-4"> Services services</span>

    <form
      id="regform"
      @submit.prevent="formAction"
      method="POST"
      class="mt-6  text-sm xl:text-sm flex flex-col space-y-4"
    >
      <span class="error-notify text-sm text-red-600">
        {{ clientError[0] }}
      </span>

      <input
        name="email"
        type="text"
        placeholder="Enter Email"
        v-model="email"
        @focus="clientError = []"
        class="input-box rounded bg-gray-200 focus:bg-white border-transparent focus:border-primary;"
        v-bind:class="{ hidden: check }"
      />
      <input
        name="username"
        type="text"
        placeholder="Username"
        v-model="username"
        @focus="clientError = []"
        class="input-box rounded bg-gray-200 focus:bg-white border-transparent focus:border-primary;"
      />
      <input
        name="currentPassword"
        type="password"
        placeholder="Password"
        v-model="password"
        @focus="clientError = []"
        class="input-box rounded bg-gray-200 focus:bg-white border-transparent focus:border-primary;"
      />

      <button id="login" class="input-box login-btn">
        <span>{{ checkMode() }}</span>
      </button>

      <button
        class="flex flex-row align-middle justify-center border-2 border-gray-200 px-2 py-2 .rounded "
      >
        <img
          class=" w-5 mx-2"
          src="@/assets/google-icon.svg"
          alt="googleicon"
          srcset=""
        />
        <span>Continue with Google</span>
      </button>

      <span class="text-left"
        >Don't sue us. Read the <a href="http://tc.com"></a>{{ "T&C" }}</span
      >

      <a v-on:click="toggleCheck" class="text-right">
        {{ toggleSign() }}
      </a>
    </form>
  </div>
</template>

<script>
export default {
  name: "registration",
  data() {
    return {
      check: true,
      mode: "Log In",
      clientError: [],
      username: "",
      email: "",
      password: ""
    };
  },

  methods: {
    toggleSign() {
      return this.check == true
        ? "Don't have an account? Register"
        : "Sign in instead";
    },
    toggleCheck() {
      this.check = !this.check;
    },

    checkForm: function() {
      switch (this.mode) {
        case "Log In":
          if (this.userName || this.password == "") {
            this.clientError = ["One or more fields are empty"];
            return false;
          }
          break;

        case "Let's go":
          if (this.email || this.userName || this.password == "") {
            this.clientError = ["One or more fields are empty"];
            return false;
          }
          break;

        default:
      }
    },

    checkMode() {
      var mode = this.check == true ? "Log In" : "Let's go!";
      this.mode = mode;
      return mode;
    },

    submitData(url, data, handleResponse) {
      let formData = new FormData();
      for (let i in data) {
        formData.append(i, data[i]);
      }

      const fparams = {
        body: formData,
        method: "POST"
      };

      fetch(url, fparams)
        .then(response => {
          if (!response.ok) throw response.status;
          return response.json();
        })
        .then(result => {
          let error = handleResponse(result);
          this.handleErr(error.message);
        })
        .catch(error => {
          console.log(error.message);
          this.handleErr(error.message);
        });

      // var xhttp = new XMLHttpRequest();
      // xhttp.onreadystatechange = () => {
      //     if (this.readyState == 4 && this.status == 200) {
      //         let val = xhttp.response
      //         console.log(val)
      //         handleResponse(val)
      //     }
      // };
      // xhttp.open("POST", url, true);
      // xhttp.send(formData);
    },

    formAction() {
      if (this.checkForm() == false) {
        this.handleErr("issues in form");
        return;
      }

      var mode = this.mode;
      var Data;

      Data =
        mode == "Log In"
          ? {
              action: "login",
              userName: this.username,
              currentPassword: this.password
            }
          : {
              action: "createUser",
              userName: this.username,
              currentPassword: this.password,
              email: this.email
            };

      this.submitData("https://localhost:8082/", Data, handleResponse);

      function handleResponse(response) {
        if (response.status == false) {
          let error = new Error(response.message);
          return error;
        }

        //call new session handler
      }
      return "";
    },

    handleErr(err) {
      this.clientError = [err];
      console.log(err);
    }
  }
};
</script>
