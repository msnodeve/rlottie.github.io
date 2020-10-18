<template>
  <div class="pt-1 pb-2">
    <v-row class="pa-0">
      <div class="pt-3">
        <v-icon class="pl-5">mdi-file-outline</v-icon>
        <span v-text="fileName" style="font-weight: 600"></span>
      </div>
      <v-spacer></v-spacer>
      <div>
        <v-tooltip bottom open-on-hover close-delay="100">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mr-1"
              dark
              v-bind="attrs"
              v-on="on"
              icon
              large
              :color="isPrev ? 'white' : 'transparent'"
              :style="{
                cursor: isPrev ? 'pointer' : 'default',
              }"
              @click="movePrev"
            >
              <v-icon :color="isPrev ? '#54565A' : '#BFC0C2'">
                mdi-undo
              </v-icon>
            </v-btn>
          </template>
          <div>
            <span>Undo (Ctrl + Z)</span>
          </div>
        </v-tooltip>
        <v-tooltip bottom open-on-hover close-delay="100">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mr-5"
              dark
              v-bind="attrs"
              v-on="on"
              icon
              large
              :color="isNext ? 'white' : 'transparent'"
              :style="{
                cursor: isNext ? 'pointer' : 'default',
              }"
              @click="moveNext"
            >
              <v-icon :color="isNext ? '#54565A' : '#BFC0C2'">
                mdi-redo
              </v-icon>
            </v-btn>
          </template>
          <span>Redo (Ctrl + Shift + Z)</span>
        </v-tooltip>
      </div>
    </v-row>
  </div>
</template>

<script>
module.exports = {
  name: 'info-bar',
  data() {
    return {
      isPrev: false,
      isNext: false,
    };
  },
  computed: {
    ...Vuex.mapGetters(['fileName']),
  },
  mounted() {
    var self = this;
    var setHistoryState = this.setHistoryState;

    document.addEventListener(
      'keydown',
      function (e) {
        if (e.ctrlKey && e.which == 83) {
          e.preventDefault();
        } else if (e.ctrlKey && e.which == 82) {
          e.preventDefault();
        } else if (e.ctrlKey && e.which == 79) {
          e.preventDefault();
        } else if (e.ctrlKey && e.which == 76) {
          e.preventDefault();
        }
      },
      false,
    );

    // Shortcut key function binding
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey && e.shiftKey && e.which == 90) {
        // Forward frame : Ctrl + Shift + Z
        e.preventDefault();
        self.moveNext();
      } else if (e.ctrlKey && e.which == 90) {
        // Backward frame : Ctrl + Z
        e.preventDefault();
        self.movePrev();
      }
    });
  },
  methods: {
    setHistoryState(e) {
      this.isPrev = e.isPrev;
      this.isNext = e.isNext;
    },
    movePrev() {
      RLottieModule.layers.movePrev();
    },
    moveNext() {
      RLottieModule.layers.moveNext();
    },
  },
};
</script>

<style></style>
