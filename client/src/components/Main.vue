<template>
  <div class="maincontent grid">
    <Nav />
    <Content />
  </div>
</template>

<script>
import Nav from "@/components/Nav.vue";
import Content from "@/components/Content.vue";

export default {
  name: "HelloWorld",
  components: {
    Nav,
    Content
  }
};
</script>

<style scoped>

    
    .maincontent {
        grid-template-columns: min-content 1fr;
        grid-template-rows: 1fr;
        grid-template-areas: 
        "nav content"
        ;
        align-items: baseline;

    }

    @media (max-width: 640px) {

        .maincontent {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr max-content;
        grid-template-areas: 
        "content"
        "nav"
        ;
        height: 100%;
        }
        
    }

</style>

