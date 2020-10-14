var store = new Vuex.Store({
  state: {
    layers: [],
  },
  getters: {
    getLayers(state) {
      return state.layers;
    }
  },
  mutations: {
    setLayers(state, payload) {
      state.layers = payload;
    }
  },
  actions: {
        
  }
})
