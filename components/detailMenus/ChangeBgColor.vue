<template>
  <div class="text-center">
    <div class="uploadBTN py-3" style="align-center">
      <v-row align="center" justify="center">
        <v-col class="pa-0" offset="2" cols="8">
          <h3 style="color:white;">Chang Bacgkroun Color</h3>
        </v-col>
        <v-col  class="pa-0 pr-4" cols="2">
          <v-btn color="rgba(0, 153, 204, 0)" :outlined="false" :depressed="true" fab x-small @click="closeSidebar()">
            <v-icon color="#ffffff">mdi-close
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <v-row>
      <v-col class="d-flex justify-center mt-5">
        <v-color-picker flat style="background-color:transparent" v-model="color"> </v-color-picker>
      </v-col>
    </v-row>
    <div class="d-flex flex-column justify-content-center align-items-start mt-5 mb-3">
      <h2 class="mt-9" style="color: white">Resize Canvas</h2>
      <v-row class="justify-center">
        <v-col cols="5" class="pb-0">
          <v-text-field cols="5" v-model="boxHeight" dark label="Height" single-line outlined></v-text-field>
        </v-col>
        <v-col cols="5" class="pb-0">
          <v-text-field cols="5" v-model="boxWidth" dark label="Width" single-line outlined></v-text-field>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "change-bg-color",
  data() {
    return {
        type: 'rgba',
        rgba: { r: 255, g: 255, b: 255, a: 1 },
        boxHeight: document.getElementById('canvasBox').style.height,
        boxWidth: document.getElementById('canvasBox').style.width,
    }
  },
  methods: {
    closeSidebar(){
      this.$emit('call-close-menu-parent');
    }
  },
  computed: {
    color: {
      get() {
        return this[this.type];
      },
      set(v) {
        this[this.type] = v;
      },
    },
    showColor() {
      if (typeof this.color === "string") return this.color;
      return JSON.stringify(
        Object.keys(this.color).reduce((color, key) => {
          color[key] = Number(this.color[key].toFixed(2));
          return color;
        }, {}),
        null,
        2
      );
    },
  },
  watch:{
    rgba() {
      const r = this.rgba.r
      const g = this.rgba.g
      const b = this.rgba.b
      const a = this.rgba.a
      document.getElementById('content').style.backgroundColor = `rgba(${r},${g},${b},${a})`
    },
    boxHeight() {
        document.getElementById('canvasBox').style.height = this.boxHeight;
        document.getElementById('canvasBox').style.width = this.boxWidth;
        this.boxHeight= document.getElementById('canvasBox').style.height;
        this.boxWidth= document.getElementById('canvasBox').style.width;
    },
    boxWidth(){
      document.getElementById('canvasBox').style.height = this.boxHeight;
      document.getElementById('canvasBox').style.width = this.boxWidth;
      this.boxHeight= document.getElementById('canvasBox').style.height;
      this.boxWidth= document.getElementById('canvasBox').style.width;
    }
  },
};
</script>

<style scoped>

input{
  border: 1px solid white !important;
  color: white;
}
span{
  color:white !important;
}

</style>