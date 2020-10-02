<template>
  <div 
    class="text-center"
    style="width:100%">
    <div class="uploadBTN py-3" style="align-center">
      <v-row align="center" justify="center">
        <v-col class="pa-0" offset="2" cols="8">
          <h3 style="color: white">Canvas</h3>
        </v-col>
        <v-col class="pa-0 pr-4" cols="2">
          <v-btn
            color="rgba(0, 153, 204, 0)"
            :outlined="false"
            :depressed="true"
            fab
            x-small
            @click="closeSidebar()"
          >
            <v-icon color="#ffffff">mdi-close </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <div class="text-center mt-4">
      <v-row class="px-5">
        <v-col cols="12" class="justify-center mt-5">
          <div class="text-left" style="color: white">Canvas Size</div>
          <v-row class="pd-0 pt-2">
            <v-col cols="8" class="text-left py-0">
              <div style="color: white">x</div>
            </v-col>
            <v-col cols="4" class="py-0">
              <v-text-field
                v-model="canvasSizeInput.width"
                solo
                dense
                dark
                hide-details
                outlined
                suffix="px"
              ></v-text-field>
            </v-col>
            <v-col cols="8" class="text-left py-0">
              <div style="color: white">y</div>
            </v-col>
            <v-col cols="4" class="py-0">
              <v-text-field
                v-model="canvasSizeInput.height"
                solo
                dense
                dark
                hide-details
                outlined
                suffix="px"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="pt-5">
            <v-col cols="12" class="py-0">
                <div class="text-left" style="color:white;">Rotation & Flip</div>
            </v-col>
          </v-row>
          <v-row class="mb-4" >
            <v-col cols="12" class="py-0">
              <div class="my-2">
                <span class="pr-2">
                  <v-btn
                    dark
                    fab
                    color="#3e4145"
                    @click="rotate(false)"
                  >
                    <v-icon color="#BFC0C2" large>mdi-rotate-left</v-icon>
                  </v-btn>
                </span>
                <span class="pr-2">
                  <v-btn
                    dark
                    fab
                    color="#3e4145"
                    @click="rotate(true)"
                  >
                    <v-icon color="#BFC0C2" large>mdi-rotate-right</v-icon>
                  </v-btn>
                </span>
                <span class="pr-2">
                  <v-btn
                    dark
                    fab
                    color="#3e4145"
                    @click="flipX"
                  >
                    <v-icon color="#BFC0C2" large>mdi-reflect-horizontal</v-icon>
                  </v-btn>
                </span>
                <span>
                  <v-btn
                    dark
                    fab
                    color="#3e4145"
                    @click="flipY"
                  >
                    <v-icon class="mdi-rotate-90" color="#BFC0C2" large>mdi-reflect-horizontal</v-icon>
                  </v-btn>
                </span>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "change-canvas",
  data() {
    return {
      canvasSizeInput: this.canvasSize,
      degree: 0,
      isFlipX: 1,
      isFlipY: 1
    };
  },
  props:{
    canvasSize: Object
  },
  methods: {
    closeSidebar() {
      this.$emit("call-close-menu-parent");
    },
    rotate(flag){
      const change = (flag)? 90: -90;
      this.degree = (this.degree + change +360)%360;
      this.apply();
    },
    flipX(){
      this.isFlipX = this.isFlipX * -1;
      this.apply();
    },
    flipY(){
      this.isFlipY = this.isFlipY * -1;
      this.apply();
    },
    apply(){
      document.getElementById("myCanvas").style.transform = `rotate(${this.degree}deg) scaleX(${this.isFlipX}) scaleY(${this.isFlipY})`
    }
  },
  computed: {
    
  },
  watch: {
    canvasSizeInput: {
      deep: true,
      handler() {
        document.getElementById("canvasBox").style.height = `${this.canvasSize.height}px`
        document.getElementById("canvasBox").style.width = `${this.canvasSize.width}px`
      }

    }
  },
  mounted() {

  }
};
</script>

<style scoped>
span {
  color: white !important;
}
.v-text-field .v-input__control .v-input__slot {
  min-height: 20px !important;
  display: flex !important;
  align-items: center !important;
}
</style>