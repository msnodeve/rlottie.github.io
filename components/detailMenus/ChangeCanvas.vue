<template>
  <div class="width-100-percent">
    <v-scroll-y-reverse-transition>
      <div v-show="isTransition">
        <div class="text-center">
          <v-row class="px-5">
            <v-col cols="12" class="justify-center pt-4">
              <div class="text-left font-white">Canvas Size</div>
              <v-row class="pd-0 pt-2">
                <v-col cols="8" class="text-left py-0">
                  <div class="pl-3 font-white">width</div>
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
                  />
                </v-col>
                <v-col cols="8" class="text-left py-0">
                  <div class="pl-3 font-white">height</div>
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
                  />
                </v-col>
              </v-row>
              <v-row class="pt-5">
                <v-col cols="12" class="py-0">
                  <div class="text-left font-white">Rotation & Flip</div>
                </v-col>
              </v-row>
              <v-row class="mb-4">
                <v-col cols="12" class="py-0">
                  <div class="my-2">
                    <span class="pr-2">
                      <v-btn dark fab color="#3e4145" @click="rotate(false)">
                        <v-icon color="#BFC0C2" large>mdi-rotate-left</v-icon>
                      </v-btn>
                    </span>
                    <span class="pr-2">
                      <v-btn dark fab color="#3e4145" @click="rotate(true)">
                        <v-icon color="#BFC0C2" large>mdi-rotate-right</v-icon>
                      </v-btn>
                    </span>
                    <span class="pr-2">
                      <v-btn dark fab color="#3e4145" @click="flipX">
                        <v-icon color="#BFC0C2" large
                          >mdi-reflect-horizontal</v-icon
                        >
                      </v-btn>
                    </span>
                    <span>
                      <v-btn dark fab color="#3e4145" @click="flipY">
                        <v-icon class="mdi-rotate-90" color="#BFC0C2" large
                          >mdi-reflect-horizontal</v-icon
                        >
                      </v-btn>
                    </span>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-scroll-y-reverse-transition>
  </div>
</template>

<script>
module.exports = {
  name: 'change-canvas',
  data() {
    return {
      canvasSizeInput: this.canvasSize,
      degree: 0,
      isFlipX: 1,
      isFlipY: 1,
      isTransition: false,
    };
  },
  props: {
    canvasSize: Object,
  },
  mounted() {
    this.isTransition = true;
  },
  methods: {
    closeSidebar() {
      this.$emit('call-close-menu-parent');
    },
    rotate(flag) {
      const change = flag ? 90 : -90;
      this.degree = (this.degree + change + 360) % 360;
      this.apply();
    },
    flipX() {
      this.isFlipX = this.isFlipX * -1;
      this.apply();
    },
    flipY() {
      this.isFlipY = this.isFlipY * -1;
      this.apply();
    },
    apply() {
      document.getElementById(
        'myCanvas',
      ).style.transform = `rotate(${this.degree}deg) scaleX(${this.isFlipX}) scaleY(${this.isFlipY})`;
    },
  },
  watch: {
    canvasSizeInput: {
      deep: true,
      handler() {
        document.getElementById(
          'canvas-box',
        ).style.height = `${this.canvasSize.height}px`;
        document.getElementById(
          'canvas-box',
        ).style.width = `${this.canvasSize.width}px`;
      },
    },
  },
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
