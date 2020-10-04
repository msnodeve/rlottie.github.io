<template>
    <div id="left-detail-bar" class="d-flex align-start justify-center" :style="{'left': '4rem', 'border-left': 'solid','position':'absolute', 'overflow-x': 'hidden','overflow-y': 'auto', 'height': height+'px'}">
        <stroke-property v-if="selectedmenu==1" @call-close-menu-parent="closeSideBarFromChild"></stroke-property>
        <transform-property v-if="selectedmenu==2" @call-close-menu-parent="closeSideBarFromChild"></transform-property>
        <change-bg-color v-if="selectedmenu==3" @call-close-menu-parent="closeSideBarFromChild"></change-bg-color>
        <change-canvas v-if="selectedmenu==4" :canvas-size="canvasSize" @call-close-menu-parent="closeSideBarFromChild"></change-canvas>
        <export-gif v-if="selectedmenu==5" @call-close-menu-parent="closeSideBarFromChild"></export-gif>
    </div>
</template>

<script>
module.exports = {
    name: "left-bar-detail",
    components:{
        'stroke-property': 'url:./detailMenus/StrokeProperty.vue',
        'transform-property': 'url:./detailMenus/TransformProperty.vue',
        'change-bg-color': 'url:./detailMenus/ChangeBgColor.vue',
        'change-canvas': 'url:./detailMenus/ChangeCanvas.vue',
        'export-gif': 'url:./detailMenus/ExportGif.vue',
    },
    props:{
        selectedmenu: Number,
        height: Number,
        canvasSize: Object
    },
    data() {
        return {
        }
    },
    methods: {
        closeSideBarFromChild(){
            this.$emit('close-sidebar');
        }
    },
    mounted(){
    }
}
</script>

<style>
#left-detail-bar{
    height: 100%;
    background-color:#292c31;
    width: 20rem;
    z-index: 99;
    /* float:left */
}
</style>