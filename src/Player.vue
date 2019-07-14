<template>
  <div class="tw-flex tw-mx-auto">
    <div class="tw-container">
      <div class="tw-flex tw-flex-col tw-items-center tw-mt-4">
        <div class="tw-inline-flex tw-flex-col tw-items-center">
          <div class="tw-inline-flex tw-flex-row">
            <h3 class="player-name">XNS AUDIO PLAYER</h3>
            <img src="./assets/logo.png" alt="logo" class="logo">
          </div>
          <div class="tw-inline-flex tw-flex-row tw-items-center tw-align-middle tw-mt-2">
            <div><router-link to="/">Home</router-link></div>
            <div class="tw-mx-3">|</div>
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
    tw-font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-tw-font-smoothing: tw-antialiased;
    -motw-z-osx-tw-font-smoothing: grayscale;
    tw-text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  .header-wrapper{
    tw-justify-content: center;
    tw-align-items: center
  }
  .logo, .player-name{

  }
  .logo{
    margin-left: 20px;
    height: 40px;
    width: auto;
  }
</style>
