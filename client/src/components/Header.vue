<template>

    <div class="header grid py-4 sm:py-12">
        
        <img class="w-10" src="@/assets/vend.svg" alt="logoimg" srcset=""/>
        <div class="headertitle grid">
            <span class="headertitletext">{{headerTitle}}</span>
            <a href="settings"><img class="w-6" src="@/assets/Settings.svg" alt="settings"></a>
            <a href="profile"><img class="w-6" src="@/assets/Profile.svg" alt="profile"></a>
        </div>
    </div>
    
</template>

<script>
export default {
    name: "Header",
    props: { 
        headerTitle: String

    }
}
</script>

<style scoped>
.header{
    grid-template-columns: max-content 1fr;
    align-items: center;

}

.headertitle{
    grid-template-columns: 1fr repeat(2, max-content);    
    gap: 1em;
    align-items: center;
}

.headertitletext{
    font-size: 1.8rem;
    font-weight: bolder;
    text-align: left;
    padding-left: 8rem;
}
</style>