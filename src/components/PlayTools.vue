<template>
  <div class="card play-controls">
    <div class="card-content">
      <div class="level">
        <div class="level-item">
          <div class="columns">
            <div class="column">
              <ion-icon @click="prevSong()" size="large" name="skip-backward"></ion-icon>
            </div>
            <div class="column">
              <ion-icon @click="play()" size="large" :name="!isPlaying ? 'play' : 'pause'"></ion-icon>
            </div>
            <div class="column">
              <ion-icon size="large" name="pause"></ion-icon>
            </div>
            <div class="column">
              <ion-icon @click="nextSong()" size="large" name="skip-forward"></ion-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayTools',
  props: ['song', 'id']
}
</script>

<style scoped>
  .play-controls{
    position: fixed;
    bottom: 0;
  }
</style>
