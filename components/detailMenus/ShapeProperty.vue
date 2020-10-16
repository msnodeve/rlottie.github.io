<template>
  <div class="text-center width-100-percent">
    <div class="upload-btn py-3">
      <v-row align="center" justify="center">
        <v-col class="pa-0" offset="2" cols="8">
          <h3 class="font-white">Shape</h3>
        </v-col>
        <v-col class="pa-0 pr-4" cols="2">
          <v-btn color="rgba(0, 153, 204, 0)" :outlined="false" :depressed="true" fab x-small @click="closeSidebar()">
            <v-icon color="#ffffff"> mdi-close </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <div class="mt-4">
      <v-row class="px-5" align="center">
        <v-col cols="12" class="mt-5">
          <div class="text-left font-white">Color</div>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-color-picker class="bg-transparent" v-model="color" flat dark width="285" />
      </v-row>
      <v-row class="pt-5 px-5" align="center">
        <v-col cols="8" class="py-0">
          <div class="text-left font-white">StrokeWidth</div>
        </v-col>
        <v-col cols="4" class="py-0">
          <v-text-field
            v-model="strokeWidth"
            class="input mt-0 pt-0"
            hide-details
            type="number"
            solo
            outlined
            dense
            dark
          />
        </v-col>
      </v-row>
      <v-row class="mb-4 px-5">
        <v-col cols="12" class="py-0">
          <v-slider v-model="strokeWidth" class="align-center" max="100" min="0" hide-details />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'shape-property',
  data() {
    return {
      interval: '',
      history: [],
    };
  },
  computed: {
    ...Vuex.mapGetters(['layerList', 'keypath']),
    color: {
      get() {
        if (this.layerList[this.keypath]) {
          return this.layerList[this.keypath].color;
        }
      },
      set(color) {
        if (this.layerList[this.keypath]) {
          this.layerList[this.keypath].color = color;
          color = {
            r: color.rgba.r / 255,
            g: color.rgba.g / 255,
            b: color.rgba.b / 255,
            a: color.rgba.a * 100,
          };

          this.setShapeColor(color);
          this.history.push({
            property: 'ShapeColor',
            args: color,
          });
        }
      },
    },

    strokeWidth: {
      get() {
        if (this.layerList[this.keypath]) {
          return this.layerList[this.keypath].strokeWidth;
        }
      },
      set(width) {
        if (this.layerList[this.keypath]) {
          this.layerList[this.keypath].strokeWidth = width;
          this.setStrokeWidth(width);

          this.history.push({
            property: 'StrokeWidth',
            args: { strokeWidth: parseInt(this.width) },
          });
        }
      },
    },
  },
  mounted() {
    var self = this;
    this.interval = setInterval(() => {
      self.clearhistory();
    }, 500);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    ...Vuex.mapActions(['setShapeColor', 'setStrokeWidth']),
    clearhistory() {
      let len = this.history.length;
      if (!len) return;

      let top = this.history.pop();
      RLottieModule.layers.insert(RLottieModule.keypath, top.property, top.args);
      this.history = [];
    },
    closeSidebar() {
      this.$emit('call-close-menu-parent');
    },
  },
};
</script>

<style scoped>
span {
  color: white !important;
}
input {
  color: white !important;
}
</style>
