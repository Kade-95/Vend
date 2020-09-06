<template>
    <div class="mt-12 bg-white flex flex-col items-center">
        <img class="logo w-24" alt="logo" src="@/assets/vend.svg" />
        <span class="bg-green mt-4"> Services services</span>

        <div class="mt-6 sm:text-xs flex flex-col space-y-2">
            <input name="email" type="text" placeholder="Enter Email" class="input-box">
            <input name="username" type="text" placeholder="Username" class="input-box">
            <input name="password" type="password" placeholder="Password" class="input-box">
            <button id="login" class="input-box login-btn">
                <span>register</span>
            </button>
            <button class="flex flex-row align-middle justify-center border-2 border-gray-300 px-2 py-2 .rounded ">
                <img class=" w-5 mx-2" src="@/assets/google-icon.svg" alt="googleicon" srcset="">
                <span c>Continue with Google</span>
            </button>
            <span>Don't sue us. Read the <a href="http://tc.com"></a>{{"T&C"}}</span>
        </div>
        <span>Already one of us? <a href="http://tc.com"></a>{{"Sign in"}}</span>
    </div>
</template>



<script>
export default {
  name: "registration"

};
</script>