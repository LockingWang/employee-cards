<script setup>
// App.vue 現在使用路由，不需要直接導入頁面組件
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
/* 全域樣式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: 'Nunito', 'Poppins', sans-serif;
}

#app {
  min-height: 100vh;
}

/* 自定義滾動條 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #f43f5e, #ec4899);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #e11d48, #db2777);
}
</style>
