<template>
  <v-app-bar
    dense
    dark
    class="header"
  >
    <div style="width:23rem">
    <v-row class="pl-3" align="center">
      <v-img
        class="cursor-pointer"
        src="./assets/logo.png"
        max-height="25"
        max-width="25"
        @click="reloadWindow"
      ></v-img>
      <v-toolbar-title
        class="pl-1 cursor-pointer"
        @click="reloadWindow"
      >
        Prettie
      </v-toolbar-title>
    </v-row>
    </div>
    <v-spacer align="center">
      <v-btn 
        v-for="(item, index) in mockUpList" :key="index"
        text 
        class="white--text height-100-percent"
        @click="(index==0) ? buttonRemove() : buttonMockup(index);">
        <v-icon dark> {{ item }} </v-icon>
      </v-btn>
    </v-spacer>

    <div style="width: 330px" align="center">
      <v-tooltip bottom class="tooltip-btn">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="rgba(255, 255, 255, 1)"
            style="text-transform: none; font-weight: 400"
            depressed
            outlined
            v-bind="attrs"
            v-on="on"
            @click="clickToUploadJson"
          >
            New File
          </v-btn>
          <input type="file" id="file-selector" accept=".json" ref="json" />
        </template>
        <span> upload New JSON File (Ctrl + O) </span>
      </v-tooltip>
      <v-tooltip bottom class="tooltip-btn">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mx-3"
            color="rgba(255, 255, 255, 1)"
            style="text-transform: none; font-weight: 400"
            depressed
            outlined
            v-bind="attrs"
            v-on="on"
            @click="exportJson"
          >
            Export
          </v-btn>
        </template>
        <span> export Json File (Ctrl + S) </span>
      </v-tooltip>
    </div>
  </v-app-bar>
</template>

<script>
module.exports = {
  name: 'upper-bar',
  props: ['left'],
  data() {
    return {
      mockUpList: ['mdi-square-off-outline', 'mdi-cellphone-android', 'mdi-watch']
    };
  },
  methods: {
    buttonRemove() {
      var parentDiv = document.querySelector('#img-background');
      if (parentDiv.childNodes.length != 0) {
        var childImg = document.querySelector('#background');
        parentDiv.removeChild(childImg);
      }
    },
    buttonMockup(buttonNo) {
      var parentDiv = document.querySelector('#img-background');
      if (parentDiv.childNodes.length != 0) {
        var childImg = document.querySelector('#background');
        parentDiv.removeChild(childImg);
      }

      var img = document.createElement('img');
      img.id = 'background';
      img.style = 'max-height:650px; max-width: 90%; margin-left: auto; margin-right: auto; display: block;';
      img.src = (buttonNo == 1) ? './assets/mock_up_phone.png' : './assets/mock_up_watch.png';
      document.querySelector('#img-background').appendChild(img);
    },
    clickToUploadJson() {
      this.$refs.json.click();
    },
    exportJson() {
      RLottieModule.layers.exportLayers();
    },
    reloadWindow() {
      location.reload();
    },
  },
  mounted() {
    var self = this;
    document.addEventListener(
      'keydown',
      function (e) {
        if (e.ctrlKey && e.which == 83) {
          e.preventDefault();
        } else if (e.ctrlKey && e.which == 79) {
          e.preventDefault();
        }
      },
      false,
    );
    // Shortcut key function binding
    document.addEventListener('keyup', function (e) {
      if (e.ctrlKey && e.which == 83) {
        // Save to Json file
        self.exportJson();
      } else if (e.ctrlKey && e.which == 79) {
        // Upload Json file
        self.clickToUploadJson();
      }
    });
  },
};
</script>

<style soped>
.pretap {
  background: #dedede;
  color: #fff;
  border: none;
  position: relative;
  font-size: 1.6em;
  padding: 0 2em;
  transition: 800ms ease all;
  outline: none;
  border-radius: 0px 0px 20px 20px;
}
.pretap:hover {
  background: #fff;
  color: #dedede;
}
.pretap:before,
.pretap:after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  height: 2px;
  width: 0;
  background: #dedede;
  transition: 400ms ease all;
}
.pretap:after {
  right: inherit;
  top: inherit;
  left: 0;
  bottom: 0;
}
.pretap:hover:before,
.pretap:hover:after {
  width: 100%;
  transition: 800ms ease all;
}
#upper-wrapper {
  position: absolute;
}
#upper-nav {
  width: 100%;
  background-color: rgba(41, 44, 49, 1);
  border-radius: 0px 0px 15px 15px;
  height: 50px;
  vertical-align: middle;
}
.v-toolbar__content {
  height: 100% !important;
}
</style>
