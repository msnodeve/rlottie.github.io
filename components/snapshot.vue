<template>
    <div class="snapWrapper" :style="{'left':pointx+'px', 'top':pointy+'px'}">
        <canvas id="preView" style="width: 100%; height: 100%; border:1px solid #dae1e7;" width="150" height="150">
        </canvas>
    </div>
</template>

<script>
module.exports = {
    props:['pointx','pointy'],
    mounted(){
        
    }
}
</script>

<style scoped>
.snapWrapper {
    width: 150px; 
    height: 150px; 
    background-color:rgba(255,255,255,0);
    position: fixed;
    z-index: 100;
}
</style>