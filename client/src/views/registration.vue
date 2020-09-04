<template>
    <div class="mt-12 bg-white flex flex-col items-center">
        <img class="logo w-24" alt="logo" src="@/assets/vend.svg" />
        <span class="bg-green mt-4"> Services services</span>

        <div class="mt-6 sm:text-xs flex flex-col space-y-4">
            <input name="email" type="text" placeholder="Enter Email" class="input-box">
            <input name="username" type="text" placeholder="Username" class="input-box">
            <input name="password" type="password" placeholder="Password" class="input-box">
            <button id="login" class="input-box login-btn">
                <span>register</span>
            </button>
        </div>
    </div>
</template>



<script>
export default {
  name: "registration"

};
</script>