<template>
  <v-footer absolute color="#292c31" class="font-weight-medium" style="min-width:745px;z-index:100;" ref="footer">
    <div 
      class="content-width-100 px-16"
    >
      <v-row
        id="snapShot"
        class="ma-0 pa-0"
        style="width:100%"
        @mousemove="snapShotFrame($event, true)"
        @mouseleave="snapShotFrame($event, false)"
      >
        <v-slider
          class="v-slider--active v-slider--focused"
          v-model="curFrame"
          min="0"
          ref="slider"
          :max="allFrame"
          :thumb-size="24"
          @Click="gotoFrame"
          hide-details="false"
          
        />
      </v-row>
    </div>
    <div
      class="content-width-100 px-14"
    >
      <v-row
        class="ma-0 pa-0"
        align="center"
      >
        <v-col
          class="py-0 px-2"
          cols="5"
        >
          <v-row
            class="ma-0 pa-0"
            align="center"
          >
            <v-btn
              color="rgba(0, 153, 204, 1)"
              :outlined="false"
              :depressed="true"
              fab x-small
              @click="playAndPause"
            >
              <v-icon
                color="#ffffff"
                v-if="playing"
              >
                mdi-pause
              </v-icon>
              <v-icon
                color="#ffffff"
                v-else>
                mdi-play
              </v-icon>
            </v-btn>
            <v-switch
              v-model="frameRateFlag"
              inset
              label="Reverse"
              style="margin-left:50px;"
              dark
            >
            </v-switch>
          </v-row>          
        </v-col>
        <v-col
          class="pa-0"
          cols="7">
          <v-row
            class="px-5">
            <v-col
              align="end"
              class="pa-0"
            >
              <v-tooltip top open-on-hover close-delay="100">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    dark
                    v-bind="attrs"
                    v-on="on"
                    icon
                    large
                    style="margin-right:10px;"
                    :color="isPrev ? 'white' : 'transparent'"
                    :style="{'cursor': isPrev ? 'pointer' : 'default'}"
                    @click="movePrev"
                  ><v-icon :color="isPrev ? '#BFC0C2':'#54565A'" large>mdi-undo</v-icon></v-btn>
                </template>
                <div>
                  <span>Undo (Ctrl + Z)</span>
                </div>
              </v-tooltip>
              <v-tooltip top open-on-hover close-delay="100">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    dark
                    v-bind="attrs"
                    v-on="on"
                    icon
                    large
                    style="margin-right:35px;"
                    :color="isNext ? 'white' : 'transparent'"
                    :style="{'cursor': isNext ? 'pointer' : 'default'}"
                    @click="moveNext"
                  ><v-icon :color="isNext ? '#BFC0C2':'#54565A'" large>mdi-redo</v-icon></v-btn>
                </template>
                <span>Redo (Ctrl + Shift + Z)</span>
              </v-tooltip>
              <v-tooltip top open-on-hover close-delay="100">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    dark
                    v-bind="attrs"
                    v-on="on"
                    icon
                    style="margin-right:0px;margin-top:3px;"                    
                    @click="exportJson()"
                  ><v-icon dark size=30>mdi-download</v-icon></v-btn>
                </template>
                <span>Export JSON(Ctrl + S)</span>
              </v-tooltip>
              
              
              <v-menu top :offset-y="true" :offset-x="true" :left="true">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    dark
                    :outlined="false"
                    :depressed="true"
                    icon
                    size=30
                    v-bind="attrs"
                    v-on="on"
                  >
                  <v-icon
                    dark
                    
                  >
                  mdi-cog
                  </v-icon>
                </template>

                <v-list
                style="width:200px; background-color:rgba(33, 33, 33, 0.9)">
                  <v-list-item
                    v-for="(item, index) in rates"
                    :key="index"
                    @click="rateSelected = index; setFrameRate(item.rate);"
                  >
                    <v-list-item-title>
                      <v-icon
                        v-if="index === rateSelected"
                        color="rgba(255,255,255,1)">
                          mdi-check
                      </v-icon>
                      <v-icon v-else color="rgba(33, 33, 33, 0)">
                          mdi-check
                      </v-icon>
                      <span
                        style="color:rgba(255,255,255,1);">
                        &nbsp;&nbsp;{{item.rate}}

                      </span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-tooltip top open-on-hover close-delay="100">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    dark
                    v-bind="attrs"
                    v-on="on"
                    icon                  
                    @click="borderOn = !borderOn"
                  >
                  <v-icon :color="borderOn ? 'white' : 'grey'" dark size=30> mdi-crop-square </v-icon>
                </template>
                <span>Border(Ctrl + B)</span>
              </v-tooltip>
            </v-col>
          </v-row>          
        </v-col>        
      </v-row>      
    </div>
  </v-footer>
</template>
<script>
module.exports = {
  name: "loading-bar",
  // props: ["user"],
  data() {
    return {
      allFrame: 0,
      curFrame: 0,
      playing: true,
      frameRateFlag: false,
      frameRate: 1,
      show: false,
      rateSelected: 3,
      rates:[
        {
          rate: 0.25
        },
        {
          rate: 0.5
        },
        {
          rate: 0.75
        },
        {
          rate: 1
        },
        {
          rate: 1.25
        },
        {
          rate: 1.50
        },
        {
          rate: 1.75
        },
        {
          rate: 2
        }
      ],

      isPrev: false,
      isNext: false,
      borderOn: true,
    };
  },
  watch: {
    frameRateFlag: function(frame){
      RLottieModule.frameRate = this.frameRateFlag ? -this.frameRate : this.frameRate
    },
    borderOn: function(){
      this.changeCanvasBorderColor()
    }
  },
  mounted() {
    var self = this;
    var setFrame = this.setFrame;
    var setCurFrame = this.setCurFrame;
    var setHistoryState = this.setHistoryState;

    EventBus.$on('setHistoryState', function(data) {
      setHistoryState(data)
    });
    EventBus.$on('setFrame', function(frames) {
      setFrame(frames.frameCount);
      setCurFrame(frames.curFrame);
    });
    document.addEventListener("keydown", function(e) {
      if(e.ctrlKey && e.which == 83) {
        e.preventDefault();
      }else if(e.ctrlKey && e.which == 82){
        e.preventDefault();
      }else if(e.ctrlKey && e.which == 79){
        e.preventDefault();
      }else if(e.ctrlKey && e.which == 76){
        e.preventDefault();
      }
    }, false)

    // Shortcut key function binding
    document.addEventListener('keydown', function(e){
      if(e.which == 32){                              // Pause and Play : Space
        self.playAndPause();
      }else if(e.ctrlKey && e.which == 83){                       // Save to Json file
        self.exportJson();
      }else if(e.ctrlKey && e.which == 82){                 // Reverse and Play : Ctrl + R
        self.frameRateFlag = !self.frameRateFlag;
      }else if(e.which == 32){                              // Pause and Play : Space
        self.playAndPause();
      }else if(e.ctrlKey && e.shiftKey && e.which == 90){   // Forward frame : Ctrl + Shift + Z
        e.preventDefault();
        self.moveNext();
      }else if(e.ctrlKey && e.which == 90){                 // Backward frame : Ctrl + Z
        e.preventDefault();
        self.movePrev();
      }else if(e.ctrlKey && e.which == 66){                 // canvas border line : Ctrl + B
        self.borderOn = !self.borderOn;
        self.changeCanvasBorderColor();
      }
    });
  },
  methods: {
    setFrame(value){
      this.allFrame = value;
    },
    setCurFrame(value){
      this.curFrame = value;
    },
    gotoFrame(e){
      onSliderDrag(this.curFrame);
    },
    snapShotFrame(evt, flag){
      const x = evt.pageX - $('#snapShot').offset().left;
      const len = $('#snapShot').width();
      let frame = x/len*this.allFrame; 
      if(frame<0) frame = 0;
      else if(frame>this.allFrame) frame = this.allFrame
      RLottieModule.renderShanpShot(frame);
      this.$emit('pointer', {x:evt.pageX, y:$('#snapShot').offset().top, isSnapShot:flag});
    },
    playAndPause(){
      buttonClicked();
      this.playing = RLottieModule.playing;
    },
    setFrameRate(value){
      this.frameRate = value;
      setFrameRate(value);
    },
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
    changeCanvasBorderColor(){
      if (!this.borderOn){
        document.getElementById('canvasBox').style.borderStyle="none";
      }else{
        document.getElementById('canvasBox').style.border="1px solid black";

      }
    },
    exportJson() {
      RLottieModule.layers.exportLayers();
    }
  },
};
</script>

<style scoped>

.v-slider__thumb-container, .v-slider__track-background, .v-slider__track-fill {
  transition: none;
}

.content-width-100{
  width:100%;
}

.play-puase-icon{
  color: #ffffff;
}

.v-label.theme--light{
  color:#ffffff;
}
.v-slider--horizontal {
  cursor: pointer;
}
</style>