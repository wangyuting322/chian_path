<template>
  <div id="app">
    <div class='flex-row'>
      <router-link to='/chainPath'>/chainPath</router-link> |
      <router-link to='/chainPathColumn'>/chainPathColumn</router-link>
      </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app{
  width: 100vw;
  height:100vh;
}
</style>
