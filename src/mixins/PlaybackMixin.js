const PlaybackMixin = {
  data(){
    return {}
  },
  watch: {
    volume(){ this.changeVolume(this.volume) }
  },
  mounted(){
    this.checkMediaSessionSupport()
  },
  methods: {
    emitCurrentSong(){
      setTimeout(()=>{
        this.$emit('current-song', this.getSongs(this.activePlayer.position)[this.getCurrentTrackId(this.activePlayer.position)])

        // update mediaSession Metadata
        this.mediaSessionController({
          title: this.activePlaylist.songs[this.activePlayer.currentTrackId].title || "unknown",
          artist: this.activePlaylist.songs[this.activePlayer.currentTrackId].artist || "unknown",
          album: this.activePlaylist.songs[this.activePlayer.currentTrackId].artist || "unknown",
          artwork: [
            { src: this.activePlaylist.songs[this.activePlayer.currentTrackId].cover || 'https://dummyimage.com/512x512', type: 'image/png' }
          ]
        })
      }, 200)
    },
    playCurrentSong(){
      this.playTrack({playerPosition: this.activePlayer.position, trackId: this.activePlayer.currentTrackId})
      setTimeout(() =>{
        this.audioListening()
        // emit new track
        this.emitCurrentSong()
      }, 200)
    },
    playSelectedSong(payload){
      this.playTrack(payload || {playerPosition: this.activePlayer.position, trackId: this.activePlayer.currentTrackId})
      setTimeout(() =>{
        this.audioListening()
        // emit new track
        this.emitCurrentSong()
      }, 200)
    },
    seekPlayer(time){
      this.audioListening(false) // stop listening to audio oject
      this.seekToTime({playerPosition: this.activePlayer.position, time: time}) // seek to given time
      setTimeout(() =>{
        this.audioListening() // resume listening to audio oject
      }, 10)
    },
    pauseSong(){
        this.pause({playerPosition: this.activePlayer.position})
    },
    playNextSong(){
      this.nextSong({playerPosition: this.activePlayer.position})
      this.audioListening(false)
      setTimeout(() =>{
        this.audioListening()
        // emit new track
        this.emitCurrentSong()
      }, 200)
    },
    playPrevSong(){
      this.audioListening(false)
      this.prevSong({playerPosition: this.activePlayer.position, playlistPosition: this.activePlayer.position})
      setTimeout(() =>{
        this.audioListening()
        // emit new track
        this.emitCurrentSong()
      }, 200)
    },
  }
};

export default PlaybackMixin
