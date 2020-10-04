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
  obj.originKeypath = ""
  obj.isSelectAll = true
  obj.fileName = "anubis.json"
  
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
      obj.layers = new Layers(this, obj.lottieHandle.get_basic_resource())      
      EventBus.$emit('initLayers', {layers: obj.layers.getLayerTree()});
      
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
      read.fileName = f.name

      read.onload = function(e) {
        RLottieModule.fileName = e.target.fileName
      }

      read.readAsText(f);      
      read.onloadend = function(e){
          
          console.log(read)
          var jsString = read.result;
          RLottieModule.reload(jsString);            
          RLottieModule.layers = new Layers(RLottieModule, jsString);                  
          EventBus.$emit('initLayers', {layers: RLottieModule.layers.getLayerTree()});       
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

function Layers(RLottieModule, jsString) {
  this.RLottieModule = RLottieModule
  this.originLayers = JSON.parse(jsString)  

  this.layerList = []  
  this.layerTree = []  
  
  this.history = [];
  this.cur = -1;
  this.top = -1;  

  function initLayerList(self, layer, keypath) {
    var new_keypath = keypath
    if(layer['nm']) {
      new_keypath = keypath + (keypath ? '\n' : '') + layer['nm']            
      self.layerList[new_keypath] = {
        type: layer['ty'],
        r : 0,
        g : 0,
        b : 0,
        a : 100,
        strokeWidth : 1,
        anchorX : 0,
        anchorY : 0,
        positionX : 0,
        positionY : 0,
        scaleWidth : 100,
        scaleHeight : 100,
        rotation : 0,
        opacity : 100,  
      } 
    }
    for(let key in layer) {
      if(Array.isArray(layer[key])) {
        for(let i in layer[key]) {
          initLayerList(self,layer[key][i], new_keypath)
        }
      }
    }
  }

  function initLayerTree(self, layer, keypath, idx, depth, type) {    
    if(idx == depth) {
      layer.type = type;
      layer.keypath = keypath.join('.');      
      return
    }

    var flag = true;
    for(let key in layer.children) {
      if(layer.children[key].name == keypath[idx]) {
        initLayerTree(self, layer.children[key], keypath, idx+1, depth, type)
        flag = false;
        break;
      }
    }

    if(flag) {
      layer.children.push({
        name: keypath[idx],
        children: []      
      })
      initLayerTree(self, layer.children[layer.children.length-1], keypath, idx+1, depth, type)
    }
  }

  this.getLayerList = function() {
    if(!this.layerList.length) {      
      let rootPath = this.originLayers.nm
      this.originLayers.nm = ''
      initLayerList(this, this.originLayers, '')      
      this.originLayers.nm = rootPath
    }
    return this.layerList;
  }

  this.getLayerTree = function() {
    if(!this.layerTree.length) {
      this.getLayerList();
      this.layerTree = [{'name': this.originLayers.nm, 'children': [], 'type':'root', 'keypath': ''}]
      for(let keypath in this.layerList) {
        var split_keypath = keypath.split('\n')
        initLayerTree(this, this.layerTree[0], split_keypath, 0, split_keypath.length, this.layerList[keypath].type)
        this.layerList[split_keypath.join('.')] = this.layerList[keypath] 
      }
      this.layerList[''] = {
        type: 'root',
        r : 0,
        g : 0,
        b : 0,
        a : 100,
        strokeWidth : 1,
        anchorX : 0,
        anchorY : 0,
        positionX : 0,
        positionY : 0,
        scaleWidth : 100,
        scaleHeight : 100,
        rotation : 0,
        opacity : 100,  
      } 
    }
    return this.layerTree;
  }

  this.setProperty = function(keypath, property, param) {
    switch(property) {
      case 'ShapeColor':     
        this.RLottieModule.fillColors(keypath, param.r, param.g, param.b, param.a)
        this.RLottieModule.strokeColors(keypath, param.r, param.g, param.b, param.a)
        break;      
      case 'StrokeWidth':
        this.RLottieModule.strokeWidth(keypath, param.strokeWidth);
        break;
      case 'TrAnchor':
        this.RLottieModule.trAnchor(keypath, param.anchorX, param.anchorY);
        break;
      case 'TrPosition':
        this.RLottieModule.trPosition(keypath, param.positionX, param.positionY);
        break;
      case 'TrScale':
        this.RLottieModule.trScale(keypath, param.scaleWidth, param.scaleHeight);
        break;
      case 'TrRotation':
        this.RLottieModule.trRotation(keypath, param.rotation);
        break;
      case 'TrOpacity':
        this.RLottieModule.trOpacity(keypath, param.opacity);
        break;
    }
  }

  this.insert = function (keypath, property, args) {
    while(this.cur < this.top) {
      this.history.pop();
      this.top--;
    }

    this.history.push({
      keypath,
      property,
      args
    });    

    this.cur = ++this.top;
    this.setHistoryState();    
  }

  this.reload = function() {
    this.RLottieModule.reload(jsString);

    let check = []
    for(let i = 0; i <= this.cur; i++) {      
      let key = this.history[i]['keypath'];
      let prop = this.history[i]['property'];
      let args = this.history[i]['args'];
      this.setProperty(key, prop, args)
    }

    this.setHistoryState();
  }

  this.highlighting = function (keypath) {    
    this.RLottieModule.lottieHandle.set_fill_opacity("**", 30);
    this.RLottieModule.lottieHandle.set_stroke_opacity("**", 30);
    for(let i = 0; i <= this.cur; i++) {      
      let key = this.history[i]['keypath'];
      let prop = this.history[i]['property'];
      let args = this.history[i]['args'];
      let params = {}
      for(let j in args) {
        params[j] = args[j]
      }
      if(prop == "ShapeColor") {        
        params.a *= 0.3
        this.setProperty(key, prop, params)
      }
    }
    this.RLottieModule.lottieHandle.set_fill_opacity(keypath, 100);            
    this.RLottieModule.lottieHandle.set_stroke_opacity(keypath, 100);   
  }

  this.setHistoryState = function() {
    EventBus.$emit('setHistoryState', {isPrev: this.hasPrev(), isNext: this.hasNext()}); 
  }

  this.hasPrev = function() {
    return this.cur != -1;
  }

  this.hasNext = function() {
    return this.cur < this.top;
  }

  this.movePrev = function() {
    if(!this.hasPrev()) {
      return false;
    }    
    this.cur--;    
    this.reload();
    this.highlighting(this.RLottieModule.keypath + (!this.RLottieModule.isSelectAll ? (this.RLottieModule.keypath ? '.**' : '**') : ''))
  }

  this.moveNext = function() {
    if(!this.hasNext()) {
      return false;
    }
    this.cur++;
    this.reload();
    this.highlighting(this.RLottieModule.keypath + (!this.RLottieModule.isSelectAll ? (this.RLottieModule.keypath ? '.**' : '**') : ''))
  }

  this.changeColor = function(layer, args) {
    if(layer.c) { 
      layer.c.k = [args.r,args.g,args.b,layer.c.k ? layer.c.k[3] : 0] 
    }else{
      layer.c = {
        'a':0,
        'k': [args.r,args.g,args.b,1]
      }
    }
    if(layer.o) { 
      layer.o.k = args.a
    }else {
      layer.o.k = {
        'a': 0,
        'k': args.a
      }
    }
  }

  this.changeWidth = function(layer, args) {
    if(layer.w) { 
      layer.w.k = args.strokeWidth
    }else{
      layer.w = {
        'a':0,
        'k': args.strokeWidth
      }
    }
  }

  this.changeTrAnchor = function(layer, args) {
    if(layer.a) { 
      layer.a.k = [args.anchorX,args.anchorY]
    }else{
      layer.a = {
        'a':0,
        'k': [args.anchorX,args.anchorY]
      }
    }
  }

  this.changeTrPosition = function(layer, args) {
    if(layer.p) { 
      layer.p.k = [args.positionX, positionY]
    }else{
      layer.p = {
        'a':0,
        'k': [args.positionX, positionY]
      }
    }
  }

  this.changeTrRotation = function(layer, args) {
    if(layer.r) { 
      layer.r.k = (parseInt(layer.r.k) + args.rotation) % 360
    }else{
      layer.r = {
        'a':0,
        'k': args.rotation
      }
    }
  }

  this.changeTrScale = function(layer, args) {
    if(layer.s) { 
      if(layer.s.k)
        layer.s.k = [parseInt(layer.s.k[0]) * args.scaleWidth / 100,parseInt(layer.s.k[1]) * args.scaleHeight / 100]
      else
        layer.s.k = [args.scaleWidth,args.scaleHeight]
    }else{
      layer.s = {
        'a':0,
        'k': [args.scaleWidth,args.scaleHeight]
      }
    }
  }

  this.changeTrOpacity = function(layer, args) {
    if(layer.o) { 
      layer.o.k = args.opacity
    }else{
      layer.o = {
        'a':0,
        'k': args.opacity
      }
    }
  }

  this.changeProperty = function (layer, keypath, property, args, flag) {                
    if(keypath.length == 0 || keypath[0] == "**") {      
      flag = true
    }
    if(flag) {      

      switch(property) {
        case "ShapeColor":
          if(layer.ty == "fl" || layer.ty == "st") {
            this.changeColor(layer, args)
          }            
          break;
        case "StrokeWidth":
          if(layer.ty == "st") {
            this.changeWidth(layer, args)
          }
          break;
        // case "TrAnchor":
        //   if(layer.ty == "tr") {
        //     this.changeTrAnchor(layer, args)
        //   }
        //   break;
        // case "TrPosition":
        //   if(layer.ty == "tr") {
        //     this.changeTrPosition(layer, args)
        //   }
        //   break;        
        // case "TrRotation":
        //   if(layer.ty == "tr") {
        //     this.changeTrRotation(layer, args)
        //   }
        //   break;
        // case "TrScale":
        //   if(layer.ty == "tr") {
        //     this.changeTrScale(layer, args)
        //   }
        //   break;
        // case "TrOpacity":
        //   if(layer.ty == "tr") {
        //     this.changeTrOpacity(layer, args)
        //   }
        //   break;        
      }
    }   
    for(let i in layer) {
      if(layer[i].nm && (keypath[0] == "**" || layer[i] == keypath[0])) {                
        this.changeProperty(layer[i], keypath.slice(keypath[0] != "**"), property, args, flag)        
      }

      if(Array.isArray(layer[i])) {
        for(let j in layer[i])
          if(layer[i][j].nm == keypath[0] || keypath[0] == "**")
            this.changeProperty(layer[i][j], keypath.slice(keypath[0] != "**"), property, args, flag) 
      }
    }
  }

  this.exportLayers = function (){
    var saveObject = JSON.parse(jsString);
    for(let i = 0; i <= this.cur; i++) {
      var {keypath, property, args} = this.history[i];
      this.changeProperty(saveObject, keypath.split("."), property, args, false);
    }

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(saveObject));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    var fileName = Math.random().toString(36).substr(2,8).toUpperCase() + '_' + this.RLottieModule.fileName
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  this.setHistoryState();
}