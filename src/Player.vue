<template>
  <div class="section">
    <div class="container">
      <div class="level">
        <div class="level-item header-wrapper">
          <h3 class="player-name">XNS AUDIO PLAYER</h3> <img src="./assets/logo.png" alt="logo" class="logo">
        </div>
      </div>
      &nbsp;
      <div class="level">
          <div class="level-item">
              <span><router-link to="/">Home</router-link></span> | <span><router-link to="/about">About</router-link></span>
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
  .play-control-item{
    color: #ffffff;
    cursor: pointer;
  }
  .continuous-play-on{
    color: #21FB92;
    margin-top: 4px;
    cursor: pointer;
  }
  .continuous-play-off{
    color: #fff;
    margin-top: 4px;
    cursor: pointer;
  }
  .volume-timer{
    background: rgba(51, 51, 51, 0.85);
  }
  .volume-timer > div.level-right > div.timer{
    padding-right: 5px;
  }
  .timer{
    float: right;
    font-size: large;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
  }
  .volume{
    float: left;
  }
</style>
