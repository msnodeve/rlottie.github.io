var store = new Vuex.Store({
  state: {
    layers: [],
    hasPrev: false,
    hasNext: false,

    curFrame: 0,
    frameCount: 0,
  },
  getters: {
    getLayers(state) {
      return state.layers;
    },
    getCurFrame(state) {
      return state.curFrame;
    },
    getFrameCount(state) {
      return state.frameCount;
    },
    getHasPrev(sate) {
      return state.hasPrev;
    },
    getHasNext(sate) {
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
