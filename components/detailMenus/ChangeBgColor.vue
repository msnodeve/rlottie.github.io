<template>
  <div class="text-center width-100-percent">
    <div class="upload-btn py-3">
      <v-row align="center" justify="center">
        <v-col class="pa-0" offset="2" cols="8">
          <h3 class="font-white">Background</h3>
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
            <v-icon color="#ffffff">mdi-close </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <v-row class="pb-3 px-5 mt-4" align="center">
      <v-col cols="12" class="py-0 mt-8">
        <div class="text-left font-white">Color</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-center pa-0">
        <v-color-picker
          class="bg-transparent"
          flat
          dark
          width="285"
          v-model="color"
        />
      </v-col>
    </v-row>
    <div class="text-center mt-0">
      <v-row class="px-5" align="center">
        <v-col cols="7" class="justify-center pt-0 pr-0">
          <div class="text-left font-white">Background Image</div>
        </v-col>
      </v-row>
    </div>
    <div id="upload-wrapper">
      <v-btn
        tile
        class="py-7"
        text
        color="white"
        id="bg-btn"
        @click="clickToBackgroundImage"
      >
        <v-icon id="bg-icon">mdi-image-plus</v-icon>
      </v-btn>
      <input
        ref="image"
        type="file"
        id="background-img"
        accept="image/*"
        @change="setBackgroundImg"
      />
    </div>
    <v-btn class="mx-4 mt-4" @click="backgroundReset" id="delete-btn">
      Delete Background Image
    </v-btn>
  </div>
</template>

<script>
module.exports = {
  name: 'change-bg-color',
  data() {
    return {
      backgroundImgFlag: false,
      rgba: { r: 255, g: 255, b: 255 },
      type: 'rgba',
    };
  },
  methods: {
    clickToBackgroundImage() {
      this.$refs.image.click();
    },
    closeSidebar() {
      this.$emit('call-close-menu-parent');
    },
    backgroundReset() {
      if (this.backgroundImgFlag) {
        var parentDiv = document.querySelector('#img-background');
        if (parentDiv.childNodes.length != 0) {
          var childImg = document.querySelector('#background');
          parentDiv.removeChild(childImg);
        }
      }
      this.backgroundImgFlag = false;
    },
    setBackgroundImg(event) {
      var file = event.target.files;
      if (file.length === 0) {
        return;
      }
      if (this.backgroundImgFlag) {
        var parentDiv = document.querySelector('#img-background');
        if (parentDiv.childNodes.length != 0) {
          var childImg = document.querySelector('#background');
          parentDiv.removeChild(childImg);
        }
      }

      var img = document.createElement('img');
      img.id = 'background';
      img.style =
        'max-height:650px; max-width: 90%; margin-left: auto; margin-right: auto; display: block;';
      var reader = new FileReader();
      reader.onload = (function (aImg) {
        return function (e) {
          aImg.src = e.target.result;
        };
      })(img);
      if (file) {
        reader.readAsDataURL(file[0]);
      }
      document.querySelector('#img-background').appendChild(img);
      this.backgroundImgFlag = true;
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
      if (typeof this.color === 'string') {
        return this.color;
      }
      return JSON.stringify(
        Object.keys(this.color).reduce((color, key) => {
          color[key] = Number(this.color[key].toFixed(2));
          return color;
        }, {}),
        null,
        2,
      );
    },
  },
  watch: {
    rgba() {
      const r = this.rgba.r;
      const g = this.rgba.g;
      const b = this.rgba.b;
      document.getElementById(
        'content',
      ).style.backgroundColor = `rgba(${r},${g},${b})`;
    },
  },
  mounted() {
    var childImg = document.querySelector('#background');
    if (childImg) {
      this.backgroundImgFlag = true;
    } else {
      this.backgroundImgFlag = false;
    }
    let rgbValue = document.getElementById('content').style.backgroundColor;
    const r = rgbValue.split(', ')[0].split('(')[1];
    const g = rgbValue.split(', ')[1];
    const b = rgbValue.split(', ')[2].slice(0, -1);
    this.rgba = { r: r, g: g, b: b };
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
.v-text-field .v-input__control .v-input__slot {
  min-height: 20px !important;
  display: flex !important;
  align-items: center !important;
}
#background-img {
  display: none;
  cursor: pointer;
}
#upload-wrapper {
  align-content: center;
}
#bg-btn {
  width: 90%;
  height: 200px;
  border: 2px dashed;
  border-radius: 20px;
  background-color: rgba(100, 100, 100, 0.2);
}
#bg-icon {
  font-size: 30px;
}
#delete-btn {
  background-color: rgba(0, 153, 204, 1);
  width: 90%;
}
</style>
