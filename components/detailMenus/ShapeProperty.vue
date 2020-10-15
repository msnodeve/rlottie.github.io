<template>
  <div class="text-center width-100-percent">
    <div class="upload-btn py-3">
      <v-row align="center" justify="center">
        <v-col class="pa-0" offset="2" cols="8">
          <h3 class="font-white">Shape</h3>
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
        <v-color-picker
          class="bg-transparent"
          v-model="picker"
          flat
          dark
          width="285"
        />
      </v-row>
      <v-row class="pt-5 px-5" align="center">
        <v-col cols="8" class="py-0">
          <div class="text-left font-white">Thickness</div>
        </v-col>
        <v-col cols="4" class="py-0">
          <v-text-field
            v-model="width"
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
          <v-slider
            v-model="width"
            class="align-center"
            max="100"
            min="0"
            hide-details
          />
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
      layerProperty: [],
      picker: null,
      setColorFlag: false,
      setStrokeFlag: false,
      stack: [],
      width: 0,
    };
  },
  mounted() {
    var self = this;

    EventBus.$on('changeKeypath', ({ keypath }) => {
      this.layerProperty = RLottieModule.layers.layerList[keypath];
      this.setStrokeFlag = false;
      this.setColor(this.layerProperty);
      this.setStrokeColor(this.layerProperty);
    });
    this.layerProperty =
      RLottieModule.layers.layerList[RLottieModule.originKeypath];
    this.setColor(this.layerProperty);
    this.setStrokeColor(this.layerProperty);

    this.interval = setInterval(() => {
      self.clearStack();
    }, 500);
  },
  beforeDestroy() {
    EventBus.$off('changeKeypath');
    clearInterval(this.interval);
  },
  watch: {
    picker() {
      if (this.setColorFlag) {
        this.layerProperty.r = this.picker.rgba.r;
        this.layerProperty.g = this.picker.rgba.g;
        this.layerProperty.b = this.picker.rgba.b;
        this.layerProperty.a = this.picker.rgba.a;

        const r = this.picker.rgba.r / 255;
        const g = this.picker.rgba.g / 255;
        const b = this.picker.rgba.b / 255;
        const a = this.picker.rgba.a * 100;

        RLottieModule.strokeColors(RLottieModule.keypath, r, g, b, a);
        RLottieModule.fillColors(RLottieModule.keypath, r, g, b, a);

        this.stack.push({
          property: 'ShapeColor',
          args: { r, g, b, a },
        });
      } else {
        this.setColorFlag = true;
      }
    },
    width(width) {
      if (this.setStrokeFlag) {
        RLottieModule.strokeWidth(RLottieModule.keypath, Number(this.width));
        this.layerProperty.strokeWidth = Number(this.width);
        this.stack.push({
          property: 'StrokeWidth',
          args: { strokeWidth: Number(this.width) },
        });
      } else {
        this.setStrokeFlag = true;
      }
    },
  },
  methods: {
    setColor({ r, g, b, a, strokeWidth }) {
      this.picker.rgba.r = r;
      this.picker.rgba.g = g;
      this.picker.rgba.b = b;
      this.picker.rgba.a = a;
    },
    setStrokeColor({ strokeWidth }) {
      this.width = strokeWidth;
    },
    closeSidebar() {
      this.$emit('call-close-menu-parent');
    },
    clearStack() {
      let len = this.stack.length;
      if (!len) return;

      let top = this.stack.pop();
      RLottieModule.layers.insert(
        RLottieModule.keypath,
        top.property,
        top.args,
      );
      this.stack = [];
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
