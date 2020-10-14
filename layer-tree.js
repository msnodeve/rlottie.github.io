function Layers(RLottieModule, jsString) {
  this.RLottieModule = RLottieModule;
  this.originLayers = JSON.parse(jsString);

  this.layerList = [];
  this.layerTree = [];

  this.history = [];
  this.cur = -1;
  this.top = -1;

  function getSelectLayer() {
    if (!this.RLottieModule.isSelectAll) {
      return (
        this.RLottieModule.keypath + (this.RLottieModule.keypath ? '.**' : '**')
      );
    } else {
      return this.RLottieModule.keypath;
    }
  }

  function initProperty(type) {
    return {
      type: type,
      color: {
        alpha: 1,
        hex: '#FFFFFF',
        hexa: '#FFFFFFFF',
        hsla: {
          h: 0,
          s: 0,
          l: 0,
          a: 1,
        },
        hsva: {
          h: 0,
          s: 0,
          v: 0,
          a: 1,
        },
        hue: 0,
        rgba: {
          r: 0,
          g: 0,
          b: 0,
          a: 1,
        },
      },
      strokeWidth: 1,
      anchorX: 0,
      anchorY: 0,
      positionX: 0,
      positionY: 0,
      scaleWidth: 100,
      scaleHeight: 100,
      rotation: 0,
      opacity: 100,
    };
  }

  function initLayerList(self, layer, keypath) {
    if (layer['nm']) {
      keypath = keypath + (keypath ? '\n' : '') + layer['nm'];
      this.layerList[keypath] = initProperty(layer['ty']);

      switch (layer['ty']) {
        case 'fl':
          this.layerList[keypath].color.r = parseInt(layer.c.k[0]) * 255;
          this.layerList[keypath].color.g = parseInt(layer.c.k[1]) * 255;
          this.layerList[keypath].color.b = parseInt(layer.c.k[2]) * 255;
          this.layerList[keypath].color.a = parseInt(layer.o.k) / 100;
          break;
        case 'st':
          this.layerList[keypath].strokeWidth = parseInt(layer.w.k);
          break;
      }
    }

    for (let i in layer) {
      if (Array.isArray(layer[i])) {
        for (let j in layer[i]) {
          initLayerList(layer[i][j], keypath);
        }
      }
    }
  }

  function initLayerTree(layer, names, idx, depth, type) {
    if (idx == depth) {
      layer.type = type;
      layer.keypath = names.join('.');
      return;
    }

    var flag = true;
    for (let i in layer.children) {
      if (layer.children[i].name == names[idx]) {
        initLayerTree(layer.children[i], names, idx + 1, depth, type);
        flag = false;
        break;
      }
    }

    if (flag) {
      layer.children.push({
        name: names[idx],
        children: [],
      });
      initLayerTree(
        layer.children[layer.children.length - 1],
        names,
        idx + 1,
        depth,
        type,
      );
    }
  }

  this.getLayerList = function () {
    if (!this.layerList.length) {
      let rootPath = this.originLayers.nm;
      this.originLayers.nm = '';
      initLayerList(this.originLayers, '');
      this.originLayers.nm = rootPath;
    }
    return this.layerList;
  };

  this.getLayerTree = function () {
    if (!this.layerTree.length) {
      var layerList = this.getLayerList();

      this.layerTree = [
        {
          name: this.originLayers.nm,
          children: [],
          type: 'root',
          keypath: '',
        },
      ];
      for (let keypath in layerList) {
        var names = keypath.split('\n');
        initLayerTree(
          this.layerTree[0],
          names,
          0,
          names.length,
          layerList[keypath].type,
        );
        layerList[names.join('.')] = layerList[keypath];
      }
      layerList[''] = initProperty('root');
    }
    return this.layerTree;
  };

  this.setProperty = function (keypath, property, param) {
    switch (property) {
      case 'ShapeColor':
        this.RLottieModule.fillColors(
          keypath,
          param.r,
          param.g,
          param.b,
          param.a,
        );
        this.RLottieModule.strokeColors(
          keypath,
          param.r,
          param.g,
          param.b,
          param.a,
        );
        break;
      case 'StrokeWidth':
        this.RLottieModule.strokeWidth(keypath, param.strokeWidth);
        break;
      case 'TrAnchor':
        this.RLottieModule.trAnchor(keypath, param.anchorX, param.anchorY);
        break;
      case 'TrPosition':
        this.RLottieModule.trPosition(
          keypath,
          param.positionX,
          param.positionY,
        );
        break;
      case 'TrScale':
        this.RLottieModule.trScale(
          keypath,
          param.scaleWidth,
          param.scaleHeight,
        );
        break;
      case 'TrRotation':
        this.RLottieModule.trRotation(keypath, param.rotation);
        break;
      case 'TrOpacity':
        this.RLottieModule.trOpacity(keypath, param.opacity);
        break;
    }
  };

  this.insert = function (keypath, property, args) {
    while (this.cur < this.top) {
      this.history.pop();
      this.top--;
    }

    this.history.push({
      keypath,
      property,
      args,
    });

    this.cur = ++this.top;
    this.setHistoryState();
  };

  this.reload = function () {
    this.RLottieModule.reload(jsString);

    let check = [];
    for (let i = 0; i <= this.cur; i++) {
      let key = this.history[i]['keypath'];
      let prop = this.history[i]['property'];
      let args = this.history[i]['args'];
      this.setProperty(key, prop, args);
    }

    this.setHistoryState();
  };

  this.highlighting = function (keypath) {
    this.RLottieModule.lottieHandle.set_fill_opacity('**', 30);
    this.RLottieModule.lottieHandle.set_stroke_opacity('**', 30);
    for (let i = 0; i <= this.cur; i++) {
      let key = this.history[i]['keypath'];
      let prop = this.history[i]['property'];
      let args = this.history[i]['args'];
      let params = {};
      for (let j in args) {
        params[j] = args[j];
      }
      if (prop == 'ShapeColor') {
        params.a *= 0.3;
        this.setProperty(key, prop, params);
      }
    }
    this.RLottieModule.lottieHandle.set_fill_opacity(keypath, 100);
    this.RLottieModule.lottieHandle.set_stroke_opacity(keypath, 100);
  };

  this.setHistoryState = function () {
    store.commit('setHasPrev', this.hasPrev());
    store.commit('setHasNext', this.hasNext());
  };

  this.hasPrev = function () {
    return this.cur != -1;
  };

  this.hasNext = function () {
    return this.cur < this.top;
  };

  this.movePrev = function () {
    if (!this.hasPrev()) {
      return false;
    }
    this.cur--;
    this.reload();
    this.highlighting(this.getSelectLayer());
  };

  this.moveNext = function () {
    if (!this.hasNext()) {
      return false;
    }
    this.cur++;
    this.reload();
    this.highlighting(this.getSelectLayer());
  };

  this.changeColor = function (layer, args) {
    if (!layer.c) {
      layer.c = {
        a: 0,
        k: [args.r, args.g, args.b, 1],
      };
    }
    if (!layer.o) {
      layer.o = {
        a: 0,
        k: args.a,
      };
    }
    layer.c.k = [args.r, args.g, args.b, layer.c.k ? layer.c.k[3] : 0];
    layer.o.k = args.a;
  };

  this.changeWidth = function (layer, args) {
    if (!layer.w) {
      layer.w = {
        a: 0,
        k: args.strokeWidth,
      };
    }
    layer.w.k = args.strokeWidth;
  };

  this.changeTrAnchor = function (layer, args) {
    if (layer.a && layer.a.k) {
      layer.a.k = [
        parseInt(layer.a.k[0]) + args.anchorX,
        parseInt(layer.a.k[1]) + args.anchorY,
      ];
    }
  };

  this.changeTrPosition = function (layer, args) {
    if (layer.p && layer.p.k) {
      layer.p.k = [
        parseInt(layer.a.k[0]) + args.positionX,
        parseInt(layer.a.k[1]) + args.positionY,
      ];
    }
  };

  this.changeTrRotation = function (layer, args) {
    if (layer.r && layer.r.k) {
      layer.r.k = (parseInt(layer.r.k) + args.rotation) % 360;
    }
  };

  this.changeTrScale = function (layer, args) {
    if (layer.s && layer.s.k) {
      layer.s.k = [
        (parseInt(layer.s.k[0]) * args.scaleWidth) / 100,
        (parseInt(layer.s.k[1]) * args.scaleHeight) / 100,
      ];
    }
  };

  this.changeTrOpacity = function (layer, args) {
    if (layer.o && layer.o.k) {
      layer.o = {
        a: 0,
        k: args.opacity,
      };
    }
  };

  this.changeProperty = function (layer, keypath, property, args, flag) {
    if (keypath.length == 0 || keypath[0] == '**') {
      flag = true;
    }

    if (flag) {
      switch (property) {
        case 'ShapeColor':
          if (layer.ty == 'fl' || layer.ty == 'st') {
            this.changeColor(layer, args);
          }
          break;
        case 'StrokeWidth':
          if (layer.ty == 'st') {
            this.changeWidth(layer, args);
          }
          break;
        case 'TrAnchor':
          if (layer.ty == 'tr') {
            this.changeTrAnchor(layer, args);
          }
          break;
        case 'TrPosition':
          if (layer.ty == 'tr') {
            this.changeTrPosition(layer, args);
          }
          break;
        case 'TrRotation':
          if (layer.ty == 'tr') {
            this.changeTrRotation(layer, args);
          }
          break;
        case 'TrScale':
          if (layer.ty == 'tr') {
            this.changeTrScale(layer, args);
          }
          break;
        case 'TrOpacity':
          if (layer.ty == 'tr') {
            this.changeTrOpacity(layer, args);
          }
          break;
      }
    }
    for (let i in layer) {
      if (layer[i].nm && (keypath[0] == '**' || layer[i] == keypath[0])) {
        this.changeProperty(
          layer[i],
          keypath.slice(keypath[0] != '**'),
          property,
          args,
          flag,
        );
      }

      if (Array.isArray(layer[i])) {
        for (let j in layer[i])
          if (layer[i][j].nm == keypath[0] || keypath[0] == '**')
            this.changeProperty(
              layer[i][j],
              keypath.slice(keypath[0] != '**'),
              property,
              args,
              flag,
            );
      }
    }
  };

  this.exportLayers = function () {
    var saveObject = JSON.parse(jsString);
    for (let i = 0; i <= this.cur; i++) {
      var { keypath, property, args } = this.history[i];
      this.changeProperty(
        saveObject,
        keypath.split('.'),
        property,
        args,
        false,
      );
    }

    var dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(saveObject));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    var fileName =
      Math.random().toString(36).substr(2, 8).toUpperCase() +
      '_' +
      this.RLottieModule.fileName;
    downloadAnchorNode.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  this.setHistoryState();
}
