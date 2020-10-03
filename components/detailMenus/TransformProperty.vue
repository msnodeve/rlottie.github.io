<template>
    <div
        class="text-center"
        style="width:100%;"> 
        <div class="uploadBTN py-3" style="align-center">
            <v-row
                align="center"
                justify="center">
                <v-col 
                class="pa-0"
                offset="2" cols="8">
                <h3 style="color:white;">
                    Transform            
                </h3>
                </v-col>
                <v-col 
                class="pa-0 pr-4"
                cols="2">
                <v-btn
                    color="rgba(0, 153, 204, 0)"
                    :outlined="false"
                    :depressed="true"
                    fab x-small
                    @click="closeSidebar()"
                >
                    <v-icon
                    color="#ffffff"
                    >
                    mdi-close
                    </v-icon>
                </v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="text-center mt-4">   
            <v-row
                class="px-5">
                <v-col cols="12" class="justify-center mt-5">
                    <div class="text-left" style="color:white;">Anchor</div>
                    <v-row class="pd-0 pt-2"> 
                        <v-col cols="8" class="text-left py-0">
                            <div class="pl-3" style="color:white;">x</div>
                        </v-col>
                        <v-col cols="4" class="py-0">
                            <v-text-field
                                v-model="anchor.x"
                                solo
                                dense
                                dark
                                hide-details
                                outlined
                            ></v-text-field>
                        </v-col>
                        <v-col cols="8" class="text-left py-0">
                            <div class="pl-3" style="color:white;">y</div>
                        </v-col>
                        <v-col cols="4" class="py-0">
                            <v-text-field
                                v-model="anchor.y"
                                solo
                                dense
                                dark
                                hide-details
                                outlined
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <div class="text-left pt-3" style="color:white;">Position</div>
                    <v-row class="pd-0 pt-2"> 
                        <v-col cols="8" class="text-left py-0">
                            <div class="pl-3" style="color:white;">x</div>
                        </v-col>
                        <v-col cols="4" class="py-0">
                            <v-text-field
                                v-model="position.x"
                                solo
                                dense
                                dark
                                hide-details
                                outlined
                            ></v-text-field>
                        </v-col>
                        <v-col cols="8" class="text-left py-0">
                            <div class="pl-3" style="color:white;">y</div>
                        </v-col>
                        <v-col cols="4" class="py-0">
                            <v-text-field
                                v-model="position.y"
                                solo
                                dense
                                dark
                                hide-details
                                outlined
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <div class="text-left pt-3" style="color:white;">Scale</div>
                    <v-row class="pd-0 pt-2"> 
                        <v-col cols="8" class="text-left py-0">
                            <div class="pl-3" style="color:white;">width</div>
                        </v-col>
                        <v-col cols="4" class="py-0">
                            <v-text-field
                                v-model="scale.w"
                                solo
                                dense
                                dark
                                hide-details
                                outlined
                            ></v-text-field>
                        </v-col>
                        <v-col cols="8" class="text-left py-0">
                            <div class="pl-3" style="color:white;">height</div>
                        </v-col>
                        <v-col cols="4" class="py-0">
                            <v-text-field
                                v-model="scale.h"
                                solo
                                dense
                                dark
                                hide-details
                                outlined
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="pt-5">
                        <v-col cols="8" class="py-0">
                            <div class="text-left" style="color:white;">Rotation</div>
                        </v-col>
                        <v-col cols="4" class="py-0">   
                            <v-text-field
                                v-model="degree"
                                class="mt-0 pt-0"
                                hide-details
                                type="number"
                                solo
                                outlined
                                dense
                                dark
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="mb-4" >
                        <v-col cols="12" class="py-0">
                            <v-slider
                                v-model="degree"
                                class="align-center"
                                max="360"
                                min="0"
                                hide-details
                            ></v-slider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="8" class="py-0">
                            <div class="text-left" style="color:white;">Opacity</div>
                        </v-col>
                        <v-col cols="4" class="py-0">   
                            <v-text-field
                                v-model="opacity"
                                class="mt-0 pt-0"
                                hide-details
                                type="number"
                                solo
                                outlined
                                dense
                                dark
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="py-0">
                            <v-slider
                                v-model="opacity"
                                class="align-center"
                                max="100"
                                min="0"
                                hide-details
                            ></v-slider>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
module.exports = {
  name: "TransformProperty",
  data() {
    return {
      anchor : {
        x: 0,
        y: 0
      },
      position : {
        x: 0,
        y: 0,
      },
      scale : {
        w: 100,
        h: 100,
      },
      degree: 0,
      opacity: 0,
      stack: [],
      layerProperty: [],

      anchorFlag: false,
      positionFlag: false,
      scaleFlag: false,
      degreeFlag: false,
      opacityFlag: false,
    };
  },
  mounted(){   
    EventBus.$on("changeKeypath", ({keypath}) => {   
        this.layerProperty = RLottieModule.layers.layerList[keypath] 
        this.anchorFlag = false;
        this.positionFlag = false;
        this.scaleFlag = false;
        this.degreeFlag = false;
        this.opacityFlag = false; 

        this.setTransform(this.layerProperty)
    })  
    this.layerProperty = RLottieModule.layers.layerList[RLottieModule.originKeypath] 
    this.setTransform(this.layerProperty)
    var self = this
    this.interval = setInterval(() => {
      self.clearStack()
    }, 500);      
  },
  beforeDestroy(){
    clearInterval(this.interval);
  },
  watch: {
    anchor:{
        deep: true,
        handler(){           
            if(this.anchorFlag){
                this.layerProperty.anchorX = this.anchor.x
                this.layerProperty.anchorY = this.anchor.y
                RLottieModule.trAnchor(RLottieModule.keypath,Number(this.anchor.x),Number(this.anchor.y))
                this.stack.push({
                    'property': 'TrAnchor',
                    'args': {anchorX: Number(this.anchor.x),anchorY: Number(this.anchor.y)}
                })
            }
            else{
                this.anchorFlag = true;
            }
        }
    },
    position: {
        deep: true,
        handler(){
            if(this.positionFlag){
                this.layerProperty.positionX = this.position.x
                this.layerProperty.positionY = this.position.y
                RLottieModule.trPosition(RLottieModule.keypath,Number(this.position.x),Number(this.position.y))
                this.stack.push({
                    'property': 'TrPosition',
                    'args': {positionX: Number(this.position.x), positionY: Number(this.position.y)}
                })
            }
            else {
                this.positionFlag = true;
            }
        }
    },
    scale: {
        deep: true,
        handler(){
            if(this.scaleFlag){                
                if(Number(this.scale.w)>=1000) this.scale.w = 1000;
                else if(Number(this.scale.w)<=0) this.scale.w = 0;
                if(Number(this.scale.h)>=1000) this.scale.h = 1000;
                else if(Number(this.scale.h)<=0) this.scale.h = 0;

                this.layerProperty.scaleWidth = this.scale.w
                this.layerProperty.scaleHeight = this.scale.h
                RLottieModule.trScale(RLottieModule.keypath,Number(this.scale.w),Number(this.scale.h))
                this.stack.push({
                    'property': 'TrScale',
                    'args': {scaleWidth: Number(this.scale.w),scaleHeight: Number(this.scale.h)}
                })
            }
            else {
                this.scaleFlag = true;
            }
        }
    },
    degree: function (val) {
        if(this.degreeFlag){
            this.layerProperty.rotation = this.degree
            RLottieModule.trRotation(RLottieModule.keypath,Number(this.degree))
            this.stack.push({
                'property': 'TrRotation',
                'args': {rotation: Number(this.degree)}
            })
        }
        else{
            this.degreeFlag = true;
        }

    },
    opacity: function (val) {
        if(this.opacityFlag){
            this.layerProperty.opacity = this.opacity
            RLottieModule.trOpacity(RLottieModule.keypath,Number(this.opacity))
            this.stack.push({
                'property': 'TrOpacity',
                'args': {opacity: Number(this.opacity)}
            })
        }
        else {
            this.opacityFlag = true;
        }
    },
  },
  computed: {
      
  },
  methods: {
    setTransform({strokeWidth,anchorX,anchorY,positionX,positionY,scaleWidth,scaleHeight,rotation,opacity}) {
        this.anchor.x = anchorX
        this.anchor.y = anchorY
        this.position.x = positionX
        this.position.y = positionY
        this.scale.w = scaleWidth
        this.scale.h = scaleHeight
        this.degree = rotation
        this.opacity = opacity
    },
    closeSidebar(){
      this.$emit("call-close-menu-parent");
    },
    clearStack() {
      let len = this.stack.length;
      if(!len)
        return

      let top = this.stack.pop()
      RLottieModule.layers.insert(RLottieModule.keypath, top.property, top.args)
      this.stack = []
    }
  },
}
</script>

<style scoped> 
 .v-text-field .v-input__control .v-input__slot {
    min-height: 20px !important;
    display: flex !important;
    align-items: center !important;
  }
</style>