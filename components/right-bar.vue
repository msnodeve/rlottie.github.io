<template>
  <div id="right-bar">
    <v-btn
      class="comp-r-0"
      fixed
      fab
      icon
      color="transparent"
      @click="isNavigation = !isNavigation"
    >
      <v-icon :color="isNavigation ? 'white' : 'grey'">
        mdi-key-variant mdi-flip-h
      </v-icon>
    </v-btn>
    <v-navigation-drawer
      v-model="isNavigation"
      right
      absolute
      color="#292c31"
      width="350"
      :height="height"
    >
      <v-switch
        class="ml-4"
        v-model="isSelectAll"
        inset
        label="Select all sub keypath"
        color="rgba(0, 153, 204, 1)"
        dark
      ></v-switch>
      <v-text-field
        class="pa-2"
        v-model="search"
        placeholder="input keypath ..."
        dark
        dense
        hide-details
        outlined
        @keydown.stop="inputKeypath"
      ></v-text-field>
      <v-treeview
        :items="layerTree"
        dark
        activatable
        hoverable
        item-key="keypath"
        item-text="keypath"
        color="rgba(0, 153, 204, 1)"
        @update:active="changeFocus"
        open-all
        ref="treeview"
        :search="search"
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="item.type == 'root'">
            {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
          </v-icon>
          <v-icon v-else-if="item.type == '4'"> mdi-layers </v-icon>
          <v-icon v-else-if="item.type == 'gr'"> mdi-crop </v-icon>
          <v-icon v-else-if="item.type == 'st'"> mdi-pencil </v-icon>
          <v-icon v-else-if="item.type == 'fl'"> mdi-format-color-fill </v-icon>
          <v-icon v-else> mdi-cancel </v-icon>
        </template>
        <template v-slot:label="{ item }">
          {{ item.name }}
        </template>
      </v-treeview>
    </v-navigation-drawer>
  </div>
</template>

<script>
module.exports = {
  name: 'right-bar',
  props: ['height'],
  data() {
    return {
      isNavigation: true,
      search: '',
    };
  },
  computed: {
    ...Vuex.mapGetters(['layerTree', 'keypath', 'selectedAllKeypath']),
    isSelectAll: {
      get() {
        return this.$store.getters.isSelectAll;
      },
      set() {
        this.$store.commit('setIsSelectAll');
      },
    },
  },
  mounted() {
    // Shortcut key function binding
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey && e.which == 76) {
        // Hide and show layer list : Ctrl + L
        self.isNavigation = !self.isNavigation;
      }
    });
  },
  methods: {
    ...Vuex.mapActions(['reloadCanvas', 'highlightingLayer']),
    changeFocus(keypath) {
      if (keypath[0] == null) keypath[0] = '';
      this.$store.commit('setKeypath', keypath[0]);
      if (!keypath[0]) {
        this.reloadCanvas();
        return;
      }
      this.highlightingLayer();
    },
    inputKeypath(e) {
      this.$refs.treeview.updateAll(this.search !== '');
    },
  },
};
</script>

<style scoped>
.v-navigation-drawer__content {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.v-navigation-drawer__content::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera*/
}
#right-bar {
  position: relative;
  z-index: 99;
  /* float:left */
}
.comp-r-0 {
  right: 0;
}
</style>
