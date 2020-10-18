var store = new Vuex.Store({
  state: {
    layers: null,

    hasPrev: false,
    hasNext: false,

    keypath: '',
    isSelectAll: true,

    curFrame: 0,
    frameCount: 0,
    frameRate: 1,

    snapShotFrame: 0,
  },
  getters: {
    layers(state) {
      return state.layers;
    },
    curFrame(state) {
      return state.curFrame;
    },
    frameCount(state) {
      return state.frameCount;
    },
    hasPrev(sate) {
      return state.hasPrev;
    },
    hasNext(sate) {
      return state.hasNext;
    },
    keypath(state) {
      return state.keypath;
    },
    isSelectAll(state) {
      return state.isSelectAll;
    },
    frameRate(state) {
      return state.frameRate;
    },
    selectedKeypath(state) {
      if (state.isSelectAll) {
        return state.keypath == '' ? '**' : state.keypath + '.**';
      } else {
        return state.keypath;
      }
    },
    selectedAllKeypath(state) {
      return state.keypath == '' ? '**' : state.keypath + '.**';
    },
    layerList(state) {
      return state.layers ? state.layers.getLayerList() : [];
    },
    layerTree(state) {
      return state.layers ? state.layers.getLayerTree() : [];
    },
    snapShotFrame(state) {
      return state.snapShotFrame;
    },
  },
  mutations: {
    setLayers(state, payload) {
      state.layers = payload;
    },
    setCurFrame(state, payload) {
      state.curFrame = payload;
    },
    setFrameCount(state, payload) {
      state.frameCount = payload;
    },
    setFrameRate(state, payload) {
      state.frameRate = payload;
    },
    setHasPrev(state, payload) {
      state.hasPrev = payload;
    },
    setHasNext(state, payload) {
      state.hasNext = payload;
    },
    setKeypath(state, payload) {
      state.keypath = payload;
    },
    setIsSelectAll(state, payload) {
      state.isSelectAll = payload;
    },
    setSnapShotFrame(state, payload) {
      state.snapShotFrame = payload;
    },
  },
  actions: {
    reloadCanvas(context) {
      const curFrame = context.getters.curFrame;
      if (context.getters.layers) context.getters.layers.reload();
      context.commit('setCurFrame', curFrame);
      onSliderDrag(curFrame);
    },
    highlightingLayer(context) {
      const { layers, selectedAllKeypath } = context.getters;
      if (layers) layers.highlighting(selectedAllKeypath);
    },
    renderSnapShot(context) {
      RLottieModule.renderSnapShot(context.getters.snapShotFrame);
    },
    setShapeColor(context, payload) {
      const { layers, selectedKeypath } = context.getters;
      const { r, g, b, a } = payload;

      layers.RLottieModule.strokeColors(selectedKeypath, r, g, b, a);
      layers.RLottieModule.fillColors(selectedKeypath, r, g, b, a);
    },
    setStrokeWidth(context, payload) {
      const { layers, selectedKeypath } = context.getters;

      layers.RLottieModule.strokeWidth(selectedKeypath, parseInt(payload));
    },

    setTrAnchor(context, payload) {
      const { layers, selectedKeypath } = context.getters;
      const { x, y } = payload;

      layers.RLottieModule.trAnchor(selectedKeypath, parseInt(x), parseInt(y));
    },

    setTrPosition(context, payload) {
      const { layers, selectedKeypath } = context.getters;
      const { x, y } = payload;
      console.log(x, y);
      layers.RLottieModule.trPosition(selectedKeypath, parseInt(x), parseInt(y));
    },

    setTrScale(context, payload) {
      const { layers, selectedKeypath } = context.getters;
      const { w, h } = payload;

      layers.RLottieModule.trScale(selectedKeypath, parseInt(w), parseInt(h));
    },

    setTrRotation(context, payload) {
      const { layers, selectedKeypath } = context.getters;

      layers.RLottieModule.trRotation(selectedKeypath, parseInt(payload));
    },

    setTrOpacity(context, payload) {
      const { layers, selectedKeypath } = context.getters;

      layers.RLottieModule.trOpacity(selectedKeypath, parseInt(payload));
    },

    pushHistory(context, payload) {
      const { layers, selectedKeypath } = context.getters;
      const { property, args } = payload;

      layers.insert(selectedKeypath, property, args);
    },
  },
});
