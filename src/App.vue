<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouterAlive: true
      }
    },
    methods: {
      reload() {
        this.isRouterAlive = false
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      }
    }
  }
</script>
<style>
::-webkit-scrollbar {
  padding-left: 2px;
  width: 5px;
  height: 5px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgb(230, 230, 230);
}

::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: #f5f5f5;
}
</style>
