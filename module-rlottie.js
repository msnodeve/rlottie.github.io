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
  obj.preview ={};
  obj.context = {};
  obj.contextPre = {};
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
      obj.preview = document.getElementById("preView");
      obj.contextPre = obj.preview.getContext('2d');

      obj.lottieHandle = new Module.RlottieWasm();
      obj.frameCount = obj.lottieHandle.frames();
      // hook to the main loop

      var originJson = obj.lottieHandle.get_basic_resource()
      obj.history = initHistory(originJson);
      obj.layers = initLayers(originJson)
      obj.export = initExportObject(originJson);      

      EventBus.$emit('initLayers', {layers: obj.layers.layers});
      
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
      EventBus.$emit('setFrame', {curFrame:obj.curFrame, frameCount:obj.frameCount});
  }

  obj.renderShanpShot = function (frame) {
    if (obj.preview.width == 0  || obj.preview.height == 0) return;

    var buffer = obj.lottieHandle.render(frame, obj.preview.width, obj.preview.height);
    var result = Uint8ClampedArray.from(buffer);
    var imageData = new ImageData(result, obj.preview.width, obj.preview.height);
    
    obj.contextPre.putImageData(imageData, 0, 0);
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
          RLottieModule.export = initExportObject(jsString);            
          
          EventBus.$emit('initLayers', {layers: RLottieModule.layers.layers});       
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
    // RLottieModule.reload(obj.originJson);

    let check = []
    for(let i = 0; i <= obj.cur; i++) {      
      let key = obj.history[i]['keypath'];
      let prop = obj.history[i]['property'];
      let args = obj.history[i]['args'];
      obj.setProperty(key, prop, args)
    }

    obj.setHistoryState();
  }

  obj.highlighting = function (keypath) {    
    RLottieModule.lottieHandle.set_fill_opacity("**", 30);
    RLottieModule.lottieHandle.set_stroke_opacity("**", 30);
    for(let i = 0; i <= obj.cur; i++) {      
      let key = obj.history[i]['keypath'];
      let prop = obj.history[i]['property'];
      let args = obj.history[i]['args'];

      if(prop == "FillColor" || prop == "StrokeColor") {
        if(args[3] > 30) {
          args[3] = 30
        }
        obj.setProperty(key, prop, args)
      }
    }
    RLottieModule.lottieHandle.set_fill_opacity(keypath, 100);            
    RLottieModule.lottieHandle.set_stroke_opacity(keypath, 100);   
  }

  obj.setHistoryState = function() {
    EventBus.$emit('setHistoryState', {isPrev: obj.hasPrev(), isNext: obj.hasNext()}); 
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
    RLottieModule.reload(obj.originJson);
    obj.reload();
  }

  obj.moveNext = function() {
    if(!obj.hasNext()) {
      return false;
    }
    obj.cur++;
    RLottieModule.reload(obj.originJson);
    obj.reload();
  }
  obj.setHistoryState();
  return obj;
} 


function initLayers(jsString) {
  var obj = {}

  var map_keypath = []
  obj.originLayers = JSON.parse(jsString)
  
  

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
  }

  obj.parseObject = function (keypath, cur, depth, layers, type) {
    if(cur == depth) {
      layers.type = type;
      layers.keypath = keypath.join('.')
      layers.split_keypath = keypath
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

function initExportObject(jsString) {
  var obj = {}
  obj.originJson = jsString;
  obj.lottieObject = JSON.parse(jsString);

  obj.changeColor = function(layers, args) {
    if(layers.c) { 
      layers.c.k = [args[0],args[1],args[2],layers.c.k ? layers.c.k[3] : 0] 
    }else{
      layers.c = {
        'a':0,
        'k': [args[0],args[1],args[2],1]
      }
    }
    if(layers.o) { 
      layers.o.k = args[3]
    }else {
      layers.o.k = {
        'a': 0,
        'k': args[3]
      }
    }
  }

  obj.changeWidth = function(layers, args) {
    if(layers.w) { 
      layers.w.k = args[0]
    }else{
      layers.w = {
        'a':0,
        'k': args[0]
      }
    }
  }

  obj.changeTrAnchor = function(layers, args) {
    if(layers.a) { 
      layers.a.k = [args[0],args[1]]
    }else{
      layers.a = {
        'a':0,
        'k': [args[0],args[1]]
      }
    }
  }

  obj.changeTrPosition = function(layers, args) {
    if(layers.p) { 
      layers.p.k = [args[0],args[1]]
    }else{
      layers.p = {
        'a':0,
        'k': [args[0],args[1]]
      }
    }
  }

  obj.changeTrRotation = function(layers, args) {
    if(layers.r) { 
      layers.r.k = (Number(layers.r.k) + args[0]) % 360
    }else{
      layers.r = {
        'a':0,
        'k': args[0]
      }
    }
  }

  obj.changeTrScale = function(layers, args) {
    if(layers.s) { 
      layers.s.k = [args[0],args[1]]
    }else{
      layers.s = {
        'a':0,
        'k': [args[0],args[1]]
      }
    }
  }

  obj.changeTrOpacity = function(layers, args) {
    if(layers.o) { 
      layers.o.k = args[0]
    }else{
      layers.o = {
        'a':0,
        'k': args[0]
      }
    }
  }

  obj.changeProperty = function (layers, keypath, property, args, flag) {                
    if(keypath.length == 0 || keypath[0] == "**") {      
      flag = true
    }
    if(flag) {      
      switch(property) {
        case "FillColor":
          if(layers.ty == "fl") {
            obj.changeColor(layers, args)
          }            
          break;
        case "StrokeColor":
          if(layers.ty == "st") {
            obj.changeColor(layers, args)
          }
          break;
        case "StrokeWidth":
          if(layers.ty == "st") {
            obj.changeWidth(layers, args)
          }
          break;
        // case "TrAnchor":
        //   if(layers.ty == "tr") {
        //     obj.changeTrAnchor(layers, args)
        //   }
        //   break;
        // case "TrPosition":
        //   if(layers.ty == "tr") {
        //     obj.changeTrPosition(layers, args)
        //   }
        //   break;        
        // case "TrRotation":
        //   if(layers.ty == "tr") {
        //     obj.changeTrRotation(layers, args)
        //   }
        //   break;
        // case "TrScale":
        //   if(layers.ty == "tr") {
        //     obj.changeTrScale(layers, args)
        //   }
        //   break;
        // case "TrOpacity":
        //   if(layers.ty == "tr") {
        //     obj.changeTrOpacity(layers, args)
        //   }
        //   break;        
      }
    }   
    for(let i in layers) {
      if(layers[i].nm && (keypath[0] == "**" || layers[i] == keypath[0])) {                
        this.changeProperty(layers[i], keypath.slice(keypath[0] != "**"), property, args, flag)        
      }

      if(Array.isArray(layers[i])) {
        for(let j in layers[i])
          if(layers[i][j].nm == keypath[0] || keypath[0] == "**")
            this.changeProperty(layers[i][j], keypath.slice(keypath[0] != "**"), property, args, flag) 
      }
    }
  }

  obj.exportLayers = function (history){
    obj.lottieObject = JSON.parse(obj.originJson);
    for(let i = 0; i <= history.cur; i++) {
      var {keypath, property, args} = history.history[i];
      
      this.changeProperty(obj.lottieObject, keypath.split("."), property, args, false);
    }

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj.lottieObject));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "temp" + ".json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  return obj;
}

