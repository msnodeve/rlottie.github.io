<template>
  <div class="text-center mt-5">
    <h2 class="mt-4" style="color: white">Change Background Color</h2>
    <v-row>
      <v-col class="d-flex justify-center mt-5">
        <v-color-picker flat style="background-color:transparent" v-model="color"> </v-color-picker>
      </v-col>
    </v-row>
    <div class="d-flex flex-column justify-content-center align-items-start mt-5 mb-3">
      <h2 class="mt-9" style="color: white">Resize Canvas</h2>
      <v-row class="justify-center">
        <v-col cols="5" class="pb-0">
          <v-text-field cols="5" v-model="inputHeight" dark label="Height" single-line outlined></v-text-field>
        </v-col>
        <v-col cols="5" class="pb-0">
          <v-text-field cols="5" v-model="inputWidth" dark label="Width" single-line outlined></v-text-field>
        </v-col>
        <v-btn @click="resizeCanvas">Resize Canvas</v-btn>
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
        inputHeight: undefined,
        inputWidth: undefined,
    }
  },
  methods: {
    changeCanvasColor() {
      document.getElementById("myCanvas").style.backgroundColor = this.color;
      document.getElementById("canvasBox").style.backgroundColor = this.color;
    },
    changeBgColor() {
      document.getElementById("content").style.backgroundColor = this.color;
    },
    resizeCanvas(){
      document.getElementById('canvasBox').style.width = String(this.inputWidth).concat("px");
      document.getElementById('canvasBox').style.height = String(this.inputHeight).concat("px");
      this.inputHeight = undefined;
      this.inputWidth = undefined;
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
    }
  },
};
</script>

<style scoped>

input{
  border: 1px solid white !important;
  color: white;
}


</style>