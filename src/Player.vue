<template>
  <div class="flex mx-auto">
    <div class="container">
      <div class="flex flex-col items-center mt-4">
        <div class="inline-flex flex-col items-center">
          <div class="inline-flex flex-row">
            <h3 class="player-name">XNS AUDIO PLAYER</h3>
            <img src="./assets/logo.png" alt="logo" class="logo">
          </div>
          <div class="inline-flex flex-row items-center align-middle mt-2">
            <div><router-link to="/">Home</router-link></div>
            <div class="mx-3">|</div>
            <div><router-link to="/about">About</router-link></div>
          </div>
        </div>
      </div>
      <router-view/>
    </div>
    <PersistentPlayer/>
  </div>
</template>

<script>
    import PersistentPlayer from './components/PersistentPlayer'
    export default {
        name: 'Player',
        components: {
            PersistentPlayer
        }
    }
</script>

<style>

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  .header-wrapper{
    justify-content: center;
    align-items: center
  }
  .logo, .player-name{

  }
  .logo{
    margin-left: 20px;
    height: 40px;
    width: auto;
  }
</style>
