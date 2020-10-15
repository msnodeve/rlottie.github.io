<template>
  <div id="l-bar" ref="leftBar">
    <div class="upload-btn">
      <v-tooltip right class="tooltip-btn">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            tile
            class="py-7"
            text
            color="white"
            v-bind="attrs"
            v-on="on"
            @click="clickToUploadJson"
          >
            <v-icon>fas fa-cloud-upload-alt</v-icon>
          </v-btn>
          <input type="file" id="file-selector" accept=".json" ref="json" />
        </template>
        <span> upload New JSON File (Ctrl + O) </span>
      </v-tooltip>
    </div>
    <div id="tool-wrapper" class="d-flex align-center">
      <div id="tool-nav" class="text-center">
        <v-tooltip right class="tooltip-btn" color="transparent">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              tile
              class="mt-5"
              text
              :color="activateColor(1)"
              v-bind:class="{ 'activate-btn': isActivate(1) }"
              @click="clickMenu(1)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon large>mdi-format-color-fill</v-icon>
            </v-btn>
          </template>

          <span>
            <v-card class="ma-0" max-width="400">
              <v-img
                class="white--text align-end"
                height="200px"
                src="./assets/change_shape.jpg"
              >
                <v-card-title class="card-title">
                  Change Fill and Stroke
                </v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0">
                Change 3 properties
              </v-card-subtitle>
              <v-card-text class="text--primary">
                <div>Color, Opacity, Width</div>
              </v-card-text>
            </v-card>
          </span>
        </v-tooltip>

        <v-tooltip right class="tooltip-btn" color="transparent">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              tile
              class="mt-5"
              text
              :color="activateColor(2)"
              v-bind:class="{ 'activate-btn': isActivate(2) }"
              @click="clickMenu(2)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>fas fa-crop</v-icon>
            </v-btn>
          </template>
          <span>
            <v-card class="ma-0" max-width="400">
              <v-img
                class="white--text align-end"
                height="200px"
                src="./assets/change_transform.jpg"
              >
                <v-card-title class="card-title">Change Transform</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0">
                Change 5 properties
              </v-card-subtitle>
              <v-card-text class="text--primary">
                <div>Anchor, Position,</div>
                <div>Scale, Rotation, Opacity</div>
              </v-card-text>
            </v-card>
          </span>
        </v-tooltip>

        <v-tooltip right class="tooltip-btn" color="transparent">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              tile
              class="mt-5"
              v-bind:class="{ 'activate-btn': isActivate(3) }"
              text
              :color="activateColor(3)"
              @click="clickMenu(3)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>fas fa-image</v-icon>
            </v-btn>
          </template>
          <span>
            <v-card class="ma-0" max-width="400">
              <v-img
                class="white--text align-end"
                height="200px"
                src="./assets/change_bg.jpg"
              >
                <v-card-title class="card-title"
                  >Change Background</v-card-title
                >
              </v-img>
              <v-card-subtitle class="pb-0">
                Change 3 properties
              </v-card-subtitle>
              <v-card-text class="text--primary">
                <div>Color, Image, Canvas Size</div>
              </v-card-text>
            </v-card>
          </span>
        </v-tooltip>

        <v-tooltip right class="tooltip-btn" color="transparent">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              tile
              class="mt-5"
              v-bind:class="{ 'activate-btn': isActivate(4) }"
              text
              :color="activateColor(4)"
              @click="clickMenu(4)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>fas fa-palette</v-icon>
            </v-btn>
          </template>
          <span>
            <v-card class="ma-0" max-width="400">
              <v-img
                class="white--text align-end"
                height="200px"
                src="./assets/change_canvas.jpg"
              >
                <v-card-title class="card-title">Change Canvas</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0">
                Change states of canvas
              </v-card-subtitle>
              <v-card-text class="text--primary">
                <div>resize, rotation, flip</div>
              </v-card-text>
            </v-card>
          </span>
        </v-tooltip>

        <v-tooltip right class="tooltip-btn" color="transparent">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              tile
              class="mt-5"
              text
              :color="activateColor(5)"
              v-bind:class="{ 'activate-btn': isActivate(5) }"
              @click="clickMenu(5)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon large>mdi-gif</v-icon>
            </v-btn>
          </template>

          <span>
            <v-card class="ma-0" max-width="400">
              <img
                class="white--text align-end"
                height="200px"
                width="400px"
                src="./assets/change_gif.gif"
              />
              <v-card-subtitle class="pb-4">
                Download .gif file
              </v-card-subtitle>
              <v-card-title
                class="card-title"
                style="position: absolute; transform: translateY(-110px)"
                >Download GIF</v-card-title
              >
            </v-card>
          </span>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'left-bar',
  props: {
    selectedmenu: Number,
  },
  methods: {
    clickMenu(i) {
      this.$emit('menuclicked', i);
    },
    isActivate: function (i) {
      if (this.selectedmenu === i) {
        return true;
      } else {
        return false;
      }
    },
    clickToUploadJson() {
      this.$refs.json.click();
    },
  },
  computed: {
    activateColor() {
      return (i) => {
        if (this.selectedmenu == i) {
          return 'white';
        } else {
          return 'grey';
        }
      };
    },
  },
  mounted() {
    var self = this;
    self.$emit('child-event', this.$refs.leftBar.clientHeight);
    window.addEventListener('resize', function (e) {
      self.$emit('child-event', e.target.innerHeight);
    });

    // Shortcut key function binding
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey && e.which == 79) {
        // Pause and Play : Space
        self.clickToUploadJson();
      }
    });

    //gif pre-loading
    let img = new Image();
    img.src = './assets/change_gif.gif';
  },
};
</script>

<style>
#l-bar {
  height: 100%;
  width: 4rem;
  background-color: #292c31;
  float: left;
}
#file-selector {
  display: none;
  cursor: pointer;
}
.upload-btn {
  border-bottom: 2px solid grey;
  align-content: center;
}
.activate-btn {
  border-left: 4px solid #0099cc;
}
.tooltip-btn {
  z-index: 100;
}
.card-title {
  color: #2b2b2b;
}
#tool-wrapper {
  height: 93%;
}
#tool-nav {
  width: 100%;
}
</style>
