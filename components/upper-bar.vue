<template>
    <v-container fluid class="pa-0" :style="{'position':'absolute'}">
        <v-row class="pa-0">
            <v-col cols="4" offset="4" class="pa-0">
                <v-row class="pa-0 test" @mouseenter="changeScrollB(true)" @mouseleave="changeScrollB(false)">
                    <v-col cols="12" class="pa-0">
                        <v-expand-transition>
                            <!-- <v-row v-if="scrollBottom" class="pa-0" justify="center"> -->
                                <v-col v-if="scrollBottom" cols="6" offset="3" class="pa-0"  style="text-align:center;">
                                    
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