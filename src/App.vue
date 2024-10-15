<template>
  <div id="app">
    <nav>
      <router-link to="/">Acasă</router-link> |
      <router-link to="/admin">Admin</router-link> |
      <router-link to="/verify">Verificare ID</router-link> |
      <router-link to="/client">Panou Client</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
// Logica componentei
</script>

<style lang="scss">
#app {
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  padding: 30px;
  text-align: center;

  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;
    margin: 0 10px;

    &.router-link-exact-active {
      color: #3c4ccf;
    }
  }
}
</style>