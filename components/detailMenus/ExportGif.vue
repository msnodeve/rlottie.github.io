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
            GIF            
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
    <div class="mt-4">
      <v-row 
        class="pb-3 px-3 mt-4"
        align="center">
        <v-col cols="12" class="py-0 mt-8">
          <div class="text-left" style="color:white;">Background Color</div>
        </v-col>
      </v-row>
      <v-row
        class="mb-4 pl-5"
        align="center"
        justify="center">        
        <v-btn class="ml-1" v-for="(color, idx) in colors" fab :color="color" x-small :key="`${idx}_color`" @click="selectColor(color, true)">
        </v-btn>        
        <div class="v-color-picker__dot ml-1" style="background-color: hsla(0,0%,100%,.12);cursor:pointer;" @click="selectColor('#000000', false)"></div>        
      </v-row>
      <v-row
        align="center"
        justify="center">        
        <v-color-picker
          v-show="isColor"
          v-model="picker"          
          flat
          hide-mode-switch
          dark
          style="background-color:transparent;"
        ></v-color-picker>
      </v-row>
      <v-row align="center"
        justify="center"
        class="pa-0 ma-0"
        style="width:100%;">
        <img id="convert-gif" src="" style="width:90%;"/>
      </v-row>
      <v-row align="center"
        justify="center"
        class="pa-0 ma-0 mt-4"
        style="width:100%;">
        <v-btn            
            @click="convertGIF"
            :loading="loading"
            style="background-color:rgba(0, 153, 204, 1); width:90%;"            
        >
            Convert to GIF
        </v-btn>            
      </v-row>

    </div>    
  </div>
</template>

<script>
module.exports = {
    name: "export-gif",
    data() {
      return {
        type: 'hex',
        hex: '#000000',
        loading: false, 
        isColor: false,        
        colors: ['#FFFFFF','#EB7D46','#B4EB46','#46EB7D','#46B4EB','#7D46EB','#EB46B4'],
      }
    },
    computed: {
      picker: {
        get () {
          return this[this.type]
        },
        set (v) {
          this[this.type] = v
        },
      },
    },
    methods: {
      closeSidebar(){
        this.$emit("call-close-menu-parent");
      },
      convertGIF() {      
          
          var self = this;
          self.loading = true;
          var hex= parseInt(this.picker.slice(1), 16)    
          var r = (hex >> 16) & 0xff
          var g = (hex >> 8) & 0xff
          var b = hex & 0xff

          var gif = new GIF({
            workers: 8,
            quality: 1,       
            background: '#fff'  ,
            transparent: 'rgba(255,255,255,0)'               
          });
      
          for(let i = 0; i <= RLottieModule.frameCount; i++){
            var buffer = RLottieModule.lottieHandle.render(i, 300, 300);
            var result = Uint8ClampedArray.from(buffer);
            var imageData = new ImageData(result, 300, 300);

            for(let i = 0; i < imageData.data.length; i+=4) {
                if(!imageData.data[i + 3]) {                  
                    imageData.data[i]     = r
                    imageData.data[i + 1] = g
                    imageData.data[i + 2] = b
                    imageData.data[i + 3] = 0
                }
            }
            gif.addFrame(imageData, {'delay': 1000/60})
          }

          gif.on('finished', function(blob) {            
            var reader = new FileReader();
            reader.onload = function(e) {
              document.getElementById('convert-gif').src = reader.result;
            }            
            document.getElementById('convert-gif').src = URL.createObjectURL(blob)            
            var dataStr = URL.createObjectURL(blob) //"data:image/gif;charset=utf-8," + encodeURIComponent(JSON.stringify(obj.lottieObject));
            var downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href",     dataStr);
            downloadAnchorNode.setAttribute("download", "temp" + ".gif");
            document.body.appendChild(downloadAnchorNode); 
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
            self.loading = false;
          });

          gif.render();
      },
      selectColor(color, flag) {
        this.picker = color
        this.isColor = flag;
      }
    },
}
</script>

<style scoped>
span{
  color:white !important;
}
</style>