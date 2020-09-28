<template>
  <div class="text-center mt-5">
    <h2 class="mt-4" style="color: white">Change Background Color</h2>
    <v-row>
      <v-col class="d-flex justify-center mt-5">
        <v-color-picker
          hide-mode-switch
          style="background-color: transparent"
          v-model="color"
        >
        </v-color-picker>
      </v-col>
    </v-row>
    <div
      class="d-flex flex-column justify-content-center align-items-start mt-5 mb-3"
    >
      <h2 class="mt-9" style="color: white">Resize Canvas</h2>
      <v-row class="justify-center">
        <v-col cols="5" class="pb-0">
          <v-text-field
            cols="5"
            v-model="inputHeight"
            dark
            label="Height"
            single-line
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="5" class="pb-0">
          <v-text-field
            cols="5"
            v-model="inputWidth"
            dark
            label="Width"
            single-line
            outlined
          ></v-text-field>
        </v-col>
        <v-btn @click="resizeCanvas">Resize Canvas</v-btn>
      </v-row>
    </div>
    <div class="text-center mt-4">
      <v-row class="px-5">
        <v-col cols="12" class="justify-center mt-5">
          <div class="text-left" style="color: white">Canvas</div>
          <v-row class="pd-0 pt-2">
            <v-col cols="8" class="text-left py-0">
              <div style="color: white">x</div>
            </v-col>
            <v-col cols="4" class="py-0">
              <v-text-field
                v-model="canvas.x"               
                solo
                dense
                dark
                hide-details
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="8" class="text-left py-0">
              <div style="color: white">y</div>
            </v-col>
            <v-col cols="4" class="py-0">
              <v-text-field
                v-model="canvas.y"
                solo
                dense
                dark
                hide-details
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
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
      type: "hexa",
      hex: "#FF00FF",
      hexa: "#FF00FFFF",
      rgba: { r: 255, g: 0, b: 255, a: 1 },
      hsla: { h: 300, s: 1, l: 0.5, a: 1 },
      hsva: { h: 300, s: 1, v: 1, a: 1 },
      inputHeight: undefined,
      inputWidth: undefined,
      canvas:{
        x: document.getElementById("canvasBox").style.width,
        y: document.getElementById("canvasBox").style.height
      }
    };
  },
  watch:{
    canvas: function(){
      console.log('hihi')
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
    resizeCanvas() {
      document.getElementById("canvasBox").style.width = String(
        this.inputWidth
      ).concat("px");
      document.getElementById("canvasBox").style.height = String(
        this.inputHeight
      ).concat("px");
      this.inputHeight = undefined;
      this.inputWidth = undefined;
    },
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
};
</script>

<style>
</style>