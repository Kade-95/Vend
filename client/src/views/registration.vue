<template>
    <div class="mt-12 pt-16 pb-16 bg-white flex flex-col self-center items-center max-w-xl m-auto sm:vshadow">
        <img 
            class="logo w-24" 
            alt="logo" 
            src="@/assets/vend.svg"
        />
        <span class="bg-green mt-4"> Services services</span>

        <form
            id="regform"
            @submit.prevent="formAction"
            method="POST"
            class="mt-6  text-sm xl:text-sm flex flex-col space-y-4">
            <span class="error-notify text-sm text-red-600">
                {{clientError}}
            </span>
            <input 
                name="email" 
                type="text" 
                placeholder="Enter Email" 
                v-model="email"
                class="input-box rounded bg-gray-200 focus:bg-white border-transparent focus:border-primary;"
                v-bind:class="{ hidden: check }"
            />
            <input
                name="username" 
                type="text" 
                placeholder="Username"
                v-model="username" 
                class="input-box rounded bg-gray-200 focus:bg-white border-transparent focus:border-primary;"
            />
            <input 
                name="password" 
                type="password" 
                placeholder="Password"
                v-model="password" 
                class="input-box rounded bg-gray-200 focus:bg-white border-transparent focus:border-primary;"
            />

            <button
                id="login" 
                class="input-box login-btn">
                <span>{{buttonAction()}}</span>
            </button>

            <button 
                class="flex flex-row align-middle justify-center border-2 border-gray-200 px-2 py-2 .rounded ">
                <img 
                    class=" w-5 mx-2" 
                    src="@/assets/google-icon.svg" 
                    alt="googleicon" 
                    srcset=""
                />
                <span>Continue with Google</span>
            </button>

            <span class="text-left">Don't sue us. Read the <a href="http://tc.com"></a>{{"T&C"}}</span>

            <a 
            v-on:click="toggleCheck" 
            class="text-right">
            {{toggleSign()}}
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
      clientError: "",
      username: "",
      email: "",
      password: ""
    }
  },
  methods: {
        toggleSign(){
            return this.check == true ? "Don't have an account? Register" : "Sign in instead" 
        },
        toggleCheck(){
            this.check = !this.check
        },
        buttonAction(){
            return this.check == true ? "Log In" : "Let's go!"
        },
        async submitData(url, data){
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'                 
                },
                body: JSON.stringify(data)
            })
            return response.json()
        },
        formAction(){
            this.submitData("http://localhost:8082/", {username: this.username, email:this.email, password:this.password})
                .then(response => {
                    if (!response.ok) {
                        this.clientError = response.message
                        console.log(response.status, response.message);
                        return self
                    } else {
                        response.json()
                    }
                })
                .then(data => {
                 console.log(data)
                })
        }
    }
};
</script>