<template>
    <v-container fluid class="pa-0" :style="{'position':'absolute'}">
        <v-row class="pa-0">
            <v-col cols="4" offset="4" class="pa-0">
                <v-row class="pa-0 test" @mouseenter="changeScrollB(true)" @mouseleave="changeScrollB(false)">
                    <v-col cols="12" class="pa-0">
                        <v-expand-transition>
                            <!-- <v-row v-if="scrollBottom" class="pa-0" justify="center"> -->
                                <v-col v-if="scrollBottom" cols="6" offset="3" class="pa-0"  style="text-align:center;">
                                    <div style="width:100%; background-color:rgba( 41, 44, 49, 1 );border-radius:0px 0px 15px 15px;height:50px;vertical-align:middle;">
                                          <v-btn
                                            color="rgba( 41, 44, 49, 0.9 )"
                                            class="white--text"
                                            @click="button1"
                                            style="height:100%;"
                                            >
                                            <v-icon
                                                dark
                                            >
                                                mdi-square-off-outline
                                             </v-icon>
                                        </v-btn>
                                        <v-btn
                                            color="rgba( 41, 44, 49, 0.9 )"
                                            class="white--text"
                                            @click="button2(0)"
                                            style="height:100%;"
                                            >
                                            <v-icon
                                                dark
                                            >
                                                mdi-cellphone-android
                                             </v-icon>
                                        </v-btn>
                                        <v-btn
                                            color="rgba( 41, 44, 49, 0.9 )"
                                            class="white--text"
                                            @click="button2(1)"
                                            style="height:100%;"
                                            >
                                            <v-icon
                                                dark
                                            >
                                                mdi-watch
                                             </v-icon>
                                        </v-btn>
                                    </div>
                                </v-col>
                        </v-expand-transition>
                    </v-col>
                    <v-col cols="12" class="pa-0">
                        <v-col cols="4" offset="4" class="pa-0"  style="text-align:center;">
                                <v-img
                                    v-if="!scrollBottom" 
                                    src="./assets/upperbar_2.png"
                                    max-width="500"
                                    max-height="300"
                                ></v-img>
                                <v-img
                                    v-else
                                    src="./assets/upperbar_1.png"
                                    max-width="500"
                                    max-height="300"
                                ></v-img>
                        </v-col>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
</v-container>
</template>

<script>
module.exports = {
    name:"upper-bar",
    props: ['left'],
    data(){
        return {
            scrollBottom: false,
            scrollTop: false,
        }
    },
    methods: {
        changeScrollB(flag){
            this.scrollBottom=flag
        },
        button1(){
            var parentDiv = document.querySelector("#img-background");
            if(parentDiv.childNodes.length!=0){
                var childImg = document.querySelector("#background");
                parentDiv.removeChild(childImg);
            }
        },
        button2(flag){
            var parentDiv = document.querySelector("#img-background");
            if(parentDiv.childNodes.length!=0){
                var childImg = document.querySelector("#background");
                parentDiv.removeChild(childImg);
            }
            
            var img = document.createElement("img");
            img.id = "background";
            img.style = "max-height:650px; max-width: 90%; margin-left: auto; margin-right: auto; display: block;"
            img.src = (flag==0)? "./assets/mock_up_1.png" : "./assets/mock_up_2.png";
            document.querySelector("#img-background").appendChild(img);
        }
    },
    mounted(){
    }
}
</script>

<style soped>
.pretap{
  background:#DEDEDE;
  color:#fff;
  border:none;
  position:relative;
  font-size:1.6em;
  padding:0 2em;
  transition:800ms ease all;
  outline:none;
  border-radius: 0px 0px 20px 20px;
}
.pretap:hover{
  background:#fff;
  color:#DEDEDE;
}
.pretap:before,.pretap:after{
  content:'';
  position:absolute;
  top:0;
  right:0;
  height:2px;
  width:0;
  background: #DEDEDE   ;
  transition:400ms ease all;
}
.pretap:after{
  right:inherit;
  top:inherit;
  left:0;
  bottom:0;
}
.pretap:hover:before,.pretap:hover:after{
  width:100%;
  transition:800ms ease all;
}


</style>