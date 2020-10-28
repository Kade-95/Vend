<template>
    <div class="content">
    <router-view></router-view>
    </div>
</template>

<script>

export default {
    name: "Content",
    props: { 
        currentPage: String,
        
    }
}
</script>

<style scoped>

.content {
    grid-area: content;
}

</style>

