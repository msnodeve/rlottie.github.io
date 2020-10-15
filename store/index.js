var store = new Vuex.Store({
  state: {
    layers: [],
    hasPrev: false,
    hasNext: false,

    curFrame: 0,
    frameCount: 0,
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
  },
});
