<template>
  <div class="section">
    <div class="container">
      <div class="level">
        <div class="level-item">
          <h3>XNS AUDIO PLAYER</h3>
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
