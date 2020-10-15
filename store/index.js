var store = new Vuex.Store({
  state: {
    layers: null,

    hasPrev: false,
    hasNext: false,

    keypath: '**',
    isSelectAll: true,

    curFrame: 0,
    frameCount: 0,
    frameRate: 1,
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
    selectedLayer(state) {
      return 0;
    },

    layerList(state) {
      return state.layers ? state.layers.getLayerList() : [];
    },
    layerTree(state) {
      return state.layers ? state.layers.getLayerTree() : [];
    },
    selectedLayer(state) {
      const layerList = state.layers.getLayerList();
      return state.layers ? layerList[state.keypath] : null;
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
    setFrameRate(state, payload) {
      state.frameRate = payload;
    },
  },
  actions: {
    reloadCanvas(context) {
      if (context.getters.layers) context.getters.layers.reload();
    },
    highlightingLayer(context) {
      if (context.getters.layers) context.getters.layers.highlighting(context.getters.selectedAllKeypath);
    },
  },
});
