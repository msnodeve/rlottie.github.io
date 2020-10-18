<template>
  <div id="l-bar" ref="leftBar">
    <div id="tool-wrapper" class="d-flex">
      <div id="tool-nav" class="text-center">
        <v-tooltip right class="tooltip-btn" color="transparent">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              tile
              text
              height="60"
              class="ma-0 px-0 width-100-percent"
              :color="activateColor(1)"
              v-bind:class="{ 'activate-btn': isActivate(1) }"
              @click="clickMenu(1)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>fas fa-fill-drip</v-icon>
              <div style="padding-top: 6px">Shape</div>
            </v-btn>
          </template>

          <span>
            <v-card class="ma-0" max-width="290">
              <v-img class="white--text align-end" height="145px" src="./assets/change_shape.jpg">
                <v-card-title class="card-title"> Change Fill and Stroke </v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0"> Change 3 properties </v-card-subtitle>
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
              height="60"
              class="ma-0 px-0 width-100-percent"
              text
              :color="activateColor(2)"
              v-bind:class="{ 'activate-btn': isActivate(2) }"
              @click="clickMenu(2)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>fas fa-crop</v-icon>
              <div style="padding-top: 6px">Transform</div>
            </v-btn>
          </template>
          <span>
            <v-card class="ma-0" max-width="290">
              <v-img class="white--text align-end" height="145px" src="./assets/change_transform.jpg">
                <v-card-title class="card-title">Change Transform</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0"> Change 5 properties </v-card-subtitle>
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
              height="60"
              class="ma-0 px-0 width-100-percent"
              v-bind:class="{ 'activate-btn': isActivate(3) }"
              text
              :color="activateColor(3)"
              @click="clickMenu(3)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>fas fa-image</v-icon>
              <div style="padding-top: 6px">Bkground</div>
            </v-btn>
          </template>
          <span>
            <v-card class="ma-0" max-width="290">
              <v-img class="white--text align-end" height="145px" src="./assets/change_bg.jpg">
                <v-card-title class="card-title">Change Background</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0"> Change 3 properties </v-card-subtitle>
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
              height="60"
              class="ma-0 px-0 width-100-percent"
              v-bind:class="{ 'activate-btn': isActivate(4) }"
              text
              :color="activateColor(4)"
              @click="clickMenu(4)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>fas fa-palette</v-icon>
              <div style="padding-top: 6px">Canvas</div>
            </v-btn>
          </template>
          <span>
            <v-card class="ma-0" max-width="290">
              <v-img class="white--text align-end" height="145px" src="./assets/change_canvas.jpg">
                <v-card-title class="card-title">Change Canvas</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0"> Change states of canvas </v-card-subtitle>
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
              height="60"
              class="ma-0 px-0 width-100-percent"
              text
              :color="activateColor(5)"
              v-bind:class="{ 'activate-btn': isActivate(5) }"
              @click="clickMenu(5)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>fas fa-photo-video</v-icon>
              <div style="padding-top: 6px">Gif</div>
            </v-btn>
          </template>

          <span>
            <v-card class="ma-0" max-width="290">
              <img class="white--text align-end" height="145px" width="290px" src="./assets/change_gif.gif" />
              <v-card-subtitle class="pb-4"> Download .gif file </v-card-subtitle>
              <v-card-title class="card-title card-gif"> Download GIF </v-card-title>
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

    //gif pre-loading
    let img = new Image();
    img.src = './assets/change_gif.gif';
  },
};
</script>

<style scoped>
#l-bar {
  height: 100%;
  width: 4.5rem;
  background-color: #0e1318;
  float: left;
}
#tool-wrapper {
  height: 93%;
}
#tool-nav {
  width: 100%;
}
.v-btn__content {
  display: block;
}
.v-btn.v-size--default {
  font-size: 10px;
  text-transform: none;
}
</style>
