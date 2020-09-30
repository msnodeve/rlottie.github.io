function setup() {
  var head = document.head;
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'rlottie-wasm.js';
  head.appendChild(script);

  script.onload = _ => {
    Module.onRuntimeInitialized = _ => {
      RLottieModule.init();
    };
  };
}

setup();

// Create a LottieView Module responsible of rendering a lotti file
var RLottieModule = (function () {
  // create a object;
  var obj = {};

  obj.canvas = {};
  obj.context = {};
  obj.lottieHandle = 0;
  obj.frameCount = 0;
  obj.curFrame = 0;
  obj.frameRate = 1;
  obj.rafId = {};
  obj.resizeId = {};
  obj.playing = true;
  obj.wasPlaying = false;   
  obj.keypath = ""
  
  obj.init = function () {
      var input = document.getElementById('fileSelector');
      input.addEventListener('change', fileSelectionChanged);
      window.addEventListener('dragover', handleDragOver, false);
      window.addEventListener('drop', handleFileSelect, false);
      window.addEventListener('resize',windowResize);
      relayoutCanvas();
      obj.canvas = document.getElementById("myCanvas");
      obj.context = obj.canvas.getContext('2d');

      obj.lottieHandle = new Module.RlottieWasm();
      obj.frameCount = obj.lottieHandle.frames();
      // hook to the main loop

      var originJson = obj.lottieHandle.get_basic_resource()
      obj.history = initHistory(originJson);
      obj.layers = initLayers(originJson)

      window.dispatchEvent(
        new CustomEvent("initLayers", {
          detail: {
            layers: obj.layers.layers
          }
        })
      );
      
      mainLoop();
  }

  obj.render = function () {
      if (obj.canvas.width == 0  || obj.canvas.height == 0) return;
      
      obj.curFrame = obj.curFrame + obj.frameRate;
      if (obj.curFrame > obj.frameCount) obj.curFrame = 0;
      if (obj.curFrame < 0) obj.curFrame = obj.frameCount;

      var buffer = obj.lottieHandle.render(obj.curFrame, obj.canvas.width, obj.canvas.height);
      var result = Uint8ClampedArray.from(buffer);
      var imageData = new ImageData(result, obj.canvas.width, obj.canvas.height);

      obj.context.putImageData(imageData, 0, 0);

      var getCurFrameEvent = new CustomEvent("CurrentFrameEvent", {
        detail:{
          frame: obj.curFrame
        }
      });
      window.dispatchEvent(getCurFrameEvent);

      var getAllFrameEvent = new CustomEvent("AllFrameEvent", {
        detail:{
          frame: obj.frameCount
        }
      });
      window.dispatchEvent(getAllFrameEvent);
  }

  obj.reload = function (jsString) {
    var len  = obj.lottieHandle.load(jsString);
    obj.frameCount = obj.lottieHandle.frames();
    obj.curFrame = 0;
    // force a render in pause state
    obj.update();
  }

  obj.update = function () {
    if (!obj.playing)
      window.requestAnimationFrame(obj.render);
  }

   obj.pause = function () {
      window.cancelAnimationFrame(obj.rafId);
      obj.playing = false;
   }

  obj.play = function () {
      obj.playing = true;
      mainLoop();
  }
  obj.isPlaying = function ()  {
       return obj.playing;
  }

  obj.fillColors = function (keypath, r, g, b, opacity) {
    obj.lottieHandle.set_fill_color(keypath, r, g, b);
    obj.lottieHandle.set_fill_opacity(keypath, opacity);
  }

  obj.strokeColors = function (keypath, r, g, b, opacity) {
    obj.lottieHandle.set_stroke_color(keypath, r, g, b);
    obj.lottieHandle.set_stroke_opacity(keypath, opacity);
  }

  obj.strokeWidth = function (keypath, width) {
    obj.lottieHandle.set_stroke_width(keypath, width);
  }

  obj.trAnchor = function (keypath, x, y) {
    obj.lottieHandle.set_tr_anchor(keypath, x, y);
  }

  obj.trPosition = function (keypath, x, y) {
    obj.lottieHandle.set_tr_position(keypath, x, y);
  }

  obj.trScale = function (keypath, w, h) {
    obj.lottieHandle.set_tr_scale(keypath, w, h);
  }
  
  obj.trRotation = function (keypath, degree) {
    obj.lottieHandle.set_tr_rotation(keypath, degree);
  }

  obj.trOpacity = function (keypath, opacity) {
    obj.lottieHandle.set_tr_opacity(keypath, opacity);
  }

   obj.seek = function (value) {
      obj.curFrame = value;
      window.requestAnimationFrame( obj.render);
   }

   function mainLoop() {
      obj.rafId = window.requestAnimationFrame( mainLoop );
      obj.render();
   }

  function relayoutCanvas() {
    var width = document.getElementById("content").clientWidth;
    var height = document.getElementById("content").clientHeight;
    var size = width;
    if (width < height)
      size = width;
    else
      size = height;
    size = size-8;

    document.getElementById("myCanvas").width  = size;
    document.getElementById("myCanvas").height  = size;
  }

   function windowResizeDone() {
      relayoutCanvas();
      if (obj.wasPlaying) {
        obj.wasPlaying = false;
        obj.play();
      } else {
        obj.update();
      }
   }

   function windowResize() {
        if (obj.isPlaying()) {
          obj.wasPlaying = true;
          obj.pause();
        }
        clearTimeout(obj.resizeId);
        obj.resizeId = setTimeout(windowResizeDone, 150);
   }

   function setChangingSlow(type, keypath, start, end){
    var startData = {
      r: 0,
      g: 0,
      b: 0,
      opacity: 0,
      width: 0,
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    }
    var endData = {
      r: 0,
      g: 0,
      b: 0,
      opacity: 0,
      width: 0,
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    }
    for(var n in start){
      startData[n] = start[n];
    }
    for(var n in end){
      endData[n] = end[n];
    }
    //will be change obj.frameRate
    var frameRate = 1
    var unit = frameRate/obj.frameCount

    var curR = startData.r+(endData.r - startData.r)*unit*obj.curFrame;
    var curG = startData.g+(endData.g - startData.g)*unit*obj.curFrame;
    var curB = startData.b+(endData.b - startData.b)*unit*obj.curFrame;
    var curOpacity = startData.opacity+(endData.opacity-startData.opacity)*unit*obj.curFrame;
    var curWidth = startData.width+(endData.width-startData.width)*unit*obj.curFrame;
    var curX = startData.x+(endData.x - startData.x)*unit*obj.curFrame;
    var curY = startData.y+(endData.y - startData.y)*unit*obj.curFrame;
    var curW = startData.w+(endData.w - startData.w)*unit*obj.curFrame; 
    var curH = startData.h+(endData.h - startData.h)*unit*obj.curFrame;
    var curDegree = startData.degree+(endData.degree - startData.degree)*unit*obj.curFrame;

    switch(type){
      case 0:
        obj.fillColors(keypath, curR, curG, curB, curOpacity);
        break;
      case 1:
        obj.strokeColors(keypath, curR, curG, curB, curOpacity);
        break;
      case 2:
        obj.strokeWidth(keypath, curWidth);
        break;
      case 3:
        obj.trAnchor(keypath, curX, curY);
        break;
      case 4:
        obj.trPosition(keypath, curX, curY);
        break;
      case 5:
        obj.trScale(keypath, curW, curH);
        break;
      case 6:
        obj.trRotation(keypath, curDegree);
        break;
      case 7:
        obj.trOpacity(keypath, curOpacity);
        break;
    }      
  }

  return obj;
}());


function buttonClicked() {
  if (RLottieModule.isPlaying()) {
      RLottieModule.playing = false;
      RLottieModule.pause();
  } else {
    RLottieModule.playing = true;
      RLottieModule.play();
  }
}

function setFrameRate(value){
  value = RLottieModule.frameRate < 0 ? -value : value;
  RLottieModule.frameRate = value;
}

function onSliderDrag(value) {
  RLottieModule.seek(value);
}

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  handleFiles(evt.dataTransfer.files);
}

function handleFiles(files) {
  for (var i = 0, f; f = files[i]; i++) {
    if (f.type.includes('json')) {
      var read = new FileReader();
      read.readAsText(f);
      read.onloadend = function(){
          var jsString = read.result;
          RLottieModule.reload(jsString);            
          RLottieModule.history = initHistory(jsString);
          RLottieModule.layers = initLayers(jsString);            
          window.dispatchEvent(
            new CustomEvent("initLayers", {
              detail: {
                layers: RLottieModule.layers.layers
              }
            })
          );       
      }
      break;
    }
  }
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy';
}

function fileSelectionChanged() {
  var input = document.getElementById('fileSelector');
  handleFiles(input.files);
}

function onResizeSliderDrag(value) {
  var width = document.getElementById("content").clientWidth;
  var height = document.getElementById("content").clientHeight;
  var size = width;
  if (width < height)
    size = width;
  else
    size = height;
  size = size-8;
  size = size * (value / 100);

  if (size < 10 )
    size = 10;
  size = size | 0;
  document.getElementById("myCanvas").width  = size;
  document.getElementById("myCanvas").height  = size;
  RLottieModule.update();
}

function initHistory(jsString) {
  var obj = {};

  obj.history = [];
  obj.cur = -1;
  obj.top = -1;
  obj.originJson = jsString;

  obj.setProperty = function(keypath, property, args) {
    
    switch(property) {
      case 'FillColor':
        console.log(keypath, [args[0]*255,args[1]*255,args[2]*255,args[3]*255])
        RLottieModule.fillColors(keypath, args[0], args[1], args[2], args[3])
        break;
      case 'StrokeColor':        
        RLottieModule.strokeColors(keypath, args[0], args[1], args[2], args[3])
        break;      
      case 'StrokeWidth':
        RLottieModule.strokeWidth(keypath, args[0]);
        break;
      case 'TrAnchor':
        RLottieModule.trAnchor(keypath, args[0], args[1]);
        break;
      case 'TrPosition':
        RLottieModule.trPosition(keypath, args[0], args[1]);
        break;
      case 'TrScale':
        RLottieModule.trScale(keypath, args[0], args[1]);
        break;
      case 'TrRotation':
        RLottieModule.trRotation(keypath, args[0]);
        break;
      case 'TrOpacity':
        RLottieModule.trOpacity(keypath, args[0]);
        break;
    }
  }

  obj.insert = function (keypath, property, args) {
    while(obj.cur < obj.top) {
      obj.history.pop();
      obj.top--;
    }

    obj.history.push({
      keypath,
      property,
      args
    });    
    obj.cur = ++obj.top;
    obj.setHistoryState();
  }

  obj.reload = function() {
    RLottieModule.reload(obj.originJson);

    let check = []
    for(let i = 0; i <= obj.cur; i++) {      
      let key = obj.history[i]['keypath'];
      let prop = obj.history[i]['property'];
      let args = obj.history[i]['args'];

      // if(!check[key]){
      //   check[key] = []        
      // }
      // if(!check[key][prop]){
      //   check[key][prop] = 1;        
      // }
      obj.setProperty(key, prop, args)
    }

    obj.setHistoryState();
  }

  obj.setHistoryState = function() {
    window.dispatchEvent(
      new CustomEvent("setHistoryState", {     
        detail: {
          isPrev: obj.hasPrev(),
          isNext: obj.hasNext(),
        }
      })
    );
  }

  obj.hasPrev = function() {
    return obj.cur != -1;
  }

  obj.hasNext = function() {
    return obj.cur < obj.top;
  }

  obj.movePrev = function() {
    if(!obj.hasPrev()) {
      return false;
    }    
    obj.cur--;    
    obj.reload();
  }

  obj.moveNext = function() {
    if(!obj.hasNext()) {
      return false;
    }
    obj.cur++;
    obj.reload();
  }
  obj.setHistoryState();
  return obj;
} 


function initLayers(jsString) {
  obj = {}

  var map_keypath = []
  obj.addKeypath = function (json_data,keypath){  
    var new_keypath = (keypath ? keypath+'\n' : '') + json_data.nm;
    var new_data = {
      type: json_data.ty,
    }  

    for(let i in json_data.assets) {
      for(let j in json_data.assets[j].layers[j])
        json_data.assets[i].layers[j].ty = '4';
        obj.addKeypath(json_data.assets[i].layers[j],new_keypath);
    }

    for(let i in json_data.layers) {
      json_data.layers[i].ty = '4';
      obj.addKeypath(json_data.layers[i],new_keypath);    
    }

    for(let i in json_data.it) {
      obj.addKeypath(json_data.it[i],new_keypath);    
    }

    for(let i in json_data.shapes) {
      obj.addKeypath(json_data.shapes[i],new_keypath);    
    }

    for(let i in json_data.masksProperties) {
      obj.addKeypath(json_data.masksProperties[i],new_keypath);    
    }

    for(let i in json_data.ef) {
      obj.addKeypath(json_data.ef[i],new_keypath);    
    }

    for(let i in json_data.d) {
      obj.addKeypath(json_data.d[i],new_keypath);    
    }

    if(json_data.tr) {
      obj.addKeypath(json_data.tr,new_keypath);    
    }

    map_keypath[new_keypath] = new_data

    // var white_list = ['assets', 'layers', 'shapes', 'it','c','ks','o','p','r','s','a','tr','w','ml2','sk','sa','so','eo','pt','or','os','e','masksProperties','x','g','h','ef','v','ir','is','tm','sy','d','t']  
    // for(let i in json_data) {
    //   if(typeof(json_data[i]) == 'object' && white_list.indexOf(i) == -1){
    //     console.log('******************', i, json_data, '*******************')
    //   }
    // }
  }

  obj.parseObject = function (keypath, cur, depth, layers, type) {
    if(cur == depth) {
      layers.type = type;
      layers.keypath = keypath.join('.')
      return;
    }

    var flag = true;
    for(let i in layers.children) {
      if(layers.children[i].name == keypath[cur]) {
        obj.parseObject(keypath, cur+1, depth, layers.children[i],type)
        flag = false;
        break;
      }
    }

    if(flag) {
      layers.children.push({
        name: keypath[cur],
        children: []      
      })
      obj.parseObject(keypath, cur+1, depth, layers.children[layers.children.length-1],type)
    }
  }

  obj.parseJson = function(json_string) {
    map_keypath = [];
    var json_data = JSON.parse(json_string);
    // console.dir(json_data);

    for(let i in json_data.assets) {
      for(let j in json_data.assets[i].layers){
        json_data.assets[i].layers[j].ty = '4'
        obj.addKeypath(json_data.assets[i].layers[j],'');
      }
    }
    for(let i in json_data.layers) {
      json_data.layers[i].ty = '4'
      obj.addKeypath(json_data.layers[i],'');    
    }

    var layers = {'keypath': '', 'name': json_data.nm ? json_data.nm : 'keypath', 'type': 'root', 'children': []};
    for(let keypath in map_keypath) {
      var split_keypath = keypath.split('\n')
      obj.parseObject(split_keypath, 0, split_keypath.length, layers, map_keypath[keypath].type)
    }    
    return layers
  }

  obj.layers = obj.parseJson(jsString)
  return obj
}