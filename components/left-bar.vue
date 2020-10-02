<template>
  <div id="l-bar" ref="leftBar">
    <div class="uploadBTN" style="align-center">
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
          <v-icon style="pointer:cursor">fas fa-cloud-upload-alt</v-icon>
          </v-btn>
          <input type="file" id="fileSelector" accept=".json" ref="json">
        </template> 
        <span>
          upload New JSON File (Ctrl + O)
        </span>
      </v-tooltip>
    </div>
    <div class="d-flex align-center" style="height: 93%;">
      <div class="text-center" style="width: 100%;">

        <v-tooltip right class="tooltip-btn">
          <template v-slot:activator="{ on, attrs }">
            <v-btn tile class="mt-5" text :color="activateBtn2(1)" v-bind:class="{ activateBtn: isActivate(1) }" @click="clickMenu(1)" v-bind="attrs" v-on="on">
              <v-icon large>mdi-format-color-fill</v-icon>
            </v-btn>
          </template>

          <span>
            <v-card class="m-0" max-width="400">
              <v-img class="white--text align-end" height="200px" 
                     src="./assets/ChangeBG3.jpg">
                <v-card-title style="color:#2b2a2a;">Change Fill and Stroke</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0">Change 3 properties</v-card-subtitle>
              <v-card-text class="text--primary">
                <div>Color, Opacity, Width</div>
                <div></div>
              </v-card-text>
            </v-card>
          </span>
        </v-tooltip>

        <v-tooltip right class="tooltip-btn">
          <template v-slot:activator="{ on, attrs }">
            <v-btn tile class="mt-5" text :color="activateBtn2(2)" v-bind:class="{ activateBtn: isActivate(2) }" @click="clickMenu(2)" v-bind="attrs" v-on="on">
              <v-icon>fas fa-crop</v-icon>
            </v-btn>
          </template>
          <span>
            <v-card class="m-0" max-width="400">
              <v-img class="white--text align-end" height="200px" 
                     src="./assets/Transform.jpg">
                <v-card-title style="color:#2b2a2a;">Change Transform</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0">Change 5 properties</v-card-subtitle>
              <v-card-text class="text--primary">
                <div>Anchor, Position,</div>
                <div>Scale, Rotation, Opacity</div>
              </v-card-text>
            </v-card>
          </span>
        </v-tooltip>

        <v-tooltip right class="tooltip-btn">
          <template v-slot:activator="{ on, attrs }">
            <v-btn tile class="mt-5" v-bind:class="{ activateBtn: isActivate(3) }" text :color="activateBtn2(3)" @click="clickMenu(3)" v-bind="attrs" v-on="on">
              <v-icon>fas fa-image</v-icon>
            </v-btn>
          </template>
          <span>                  
            <v-card class="m-0 p-0" max-width="400">
              <v-img class="white--text align-end" height="200px" 
              src="./assets/ChangeBG.jpg">
                <v-card-title style="color:#2b2a2a;">Change Background</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0">Change 3 properties</v-card-subtitle>
              <v-card-text class="text--primary">                
                <div>Color, Image, Canvas Size</div>
              </v-card-text>
            </v-card>
          </span>
        </v-tooltip>

        <v-tooltip right class="tooltip-btn">
          <template v-slot:activator="{ on, attrs }">
            <v-btn tile class="mt-5" v-bind:class="{ activateBtn: isActivate(4) }" text :color="activateBtn2(4)" @click="clickMenu(4)" v-bind="attrs" v-on="on">
              <v-icon >fas fa-palette</v-icon>
            </v-btn>
          </template>
          <span>                  
            <v-card class="m-0 p-0" max-width="400">
              <v-img class="white--text align-end" height="200px" 
                src="./assets/ChangeStroke.jpg">
                <v-card-title style="color:#2b2a2a;">Change Canvas</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0">Change 3 properties</v-card-subtitle>
              <v-card-text class="text--primary">                
                <div>resize, rotation, flip</div>
              </v-card-text>
            </v-card>
          </span>
        </v-tooltip>

        <v-tooltip right class="tooltip-btn">
          <template v-slot:activator="{ on, attrs }">
            <v-btn tile class="mt-5" text :color="activateBtn2(5)" v-bind:class="{ activateBtn: isActivate(5) }" @click="clickMenu(5)" v-bind="attrs" v-on="on">
              <v-icon large>mdi-gif</v-icon>
            </v-btn>
          </template>

          <span>
            <v-card class="m-0" max-width="400">
              <img class="white--text align-end" height="200px" width="400px"
              src="./assets/animation_500_kfqx0wpg.gif">
              <v-card-subtitle class="pb-0">download .gif file</v-card-subtitle>
              <v-card-title style="color:#2b2a2a;position:absolute;transform:translateY(-110px);">Download GIF</v-card-title>
              <v-card-text class="text--primary">
                <div></div>
              </v-card-text>
            </v-card>
          </span>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name:"left-bar",
  props:{
    selectedmenu: Number,
  },
  methods:{
    clickMenu(i){
      this.$emit('menuclicked', i)
    },
    isActivate: function(i) {
      if (this.selectedmenu === i){
        return true
      }else{
        return false
      }
    },
    clickToUploadJson(){
      this.$refs.json.click();
    }
  },
  computed:{
    activateBtn2(){
      return (i) => {
        if (this.selectedmenu == i){
          return 'white'
        }
        else{
          return 'grey'
        }
      }
    }
  },
  mounted() {
    var self = this;
    self.$emit('child-event', this.$refs.leftBar.clientHeight);
    window.addEventListener("resize", function(e) {
      self.$emit('child-event', e.target.innerHeight);
    });

    // Shortcut key function binding
    document.addEventListener('keydown', function(e){
      if(e.ctrlKey && e.which == 79){                                    // Pause and Play : Space
        self.clickToUploadJson();
      }
    });

    //gif pre-loading
    let img = new Image();
    img.src= "./assets/animation_500_kfqx0wpg.gif";
  },
  beforeDestroy() {
    // window.removeEventListener("resize");
  }
}
</script>

<style>
  #l-bar{
    height: 100%;
    width: 4rem;
    background-color: #292c31;
    float:left
  }
  #fileSelector{
    display:none;
    cursor: pointer;
  }
  .uploadBTN{
    border-bottom: 2px solid grey;
  }
  .activateBtn{
    border-left: 4px solid #0099cc;
  }
  .tooltip-btn{
    z-index: 100;
  }
</style>