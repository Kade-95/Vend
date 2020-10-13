<template>
    <div class="homecontainer sm:pl-8 sm:pr-8 lg:pr-12 lg:pl-12 xl:pr-16 xl:pl-16">
        <Header />
        <Main />
    </div>  
</template>

<script>
import Header from "@/components/Header.vue";
import Main from "@/components/Main.vue";

export default {
    name: "Home",
    components: {
        Header,
        Main
    },   
}
</script>

<style scoped>

.homecontainer{
    display: grid;
    grid-template-rows: max-content 1fr;
    height: 100%;
    
}

</style>