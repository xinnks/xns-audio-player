import {mapGetters, mapActions, mapState} from 'vuex'
const PlayerMixin = {
  data(){
    return {
      progressColor: "#21FB92",
      progressBgColor: "#ffffff",
      hidePlayer: true, // for persistent player
      progressHeightMain: 8,
      volumeHeightMain: 8,
      progressHeightPersistent: 15,
      volumeHeightPersistent: 5,
    }
  },
  watch: {
    volume(){ this.changeVolume(this.volume) }
  },
  computed: {
    ...mapState([
      'playlists',
      'activePlayer',
      'activePlaylist',
      'volume',
      'isPlaying',
      'playerIsLoading',
      'currentTrackId',
      'currentTrackTime',
      'currentTrackDuration',
      'isPaused',
      'isStopped',
      'isMuted',
      'continuousPlaybackStatus'
    ]),
    ...mapGetters(['getAudio', 'getSongs', 'getSongsCount', 'getVolume', 'getCurrentTrackId', 'getCurrentTrackTime', 'getCurrentTrackDuration', 'getPlayerIsLoading', 'getPlayerIsPlaying', 'getPlayerIsPaused', 'getPlayerIsStopped', 'getContinuousPlaybackStatus', 'getCurrentTrackId'])
  },
  methods: {
    emitCurrentSong(){
      setTimeout(()=>{
        this.$emit('current-song', this.getSongs[this.getCurrentTrackId])
      }, 200)
    },
    playCurrentSong(){
      this.playTrack()
      setTimeout(() =>{
        this.audioListening()
        // emit new track
        this.emitCurrentSong()
      }, 200)
    },
    playSelectedSong(trackId){
      this.playTrack(trackId)
      setTimeout(() =>{
        this.audioListening()
        // emit new track
        this.emitCurrentSong()
      }, 200)
    },
    seekPlayer(time){
      this.audioListening(false) // stop listening to audio oject
      this.seekToTime(time) // seek to given time
      setTimeout(() =>{
        this.audioListening() // resume listening to audio oject
      }, 10)
    },
    pauseSong(){
      this.pause()
    },
    playNextSong(){
      this.nextSong()
      this.audioListening(false)
      setTimeout(() =>{
        this.audioListening()
        // emit new track
        this.emitCurrentSong()
      }, 200)
    },
    playPrevSong(){
      this.audioListening(false)
      this.prevSong()
      setTimeout(() =>{
        this.audioListening()
        // emit new track
        this.emitCurrentSong()
      }, 200)
    },
    audioListening(listen = true){
      if(listen){
        // start listening
        this.getAudio.addEventListener('loadeddata', this.proccessPlaybackStart, false)
        this.getAudio.addEventListener('timeupdate', this.proccessPlaybackTimeUpdate, false)
        this.getAudio.addEventListener('pause', this.proccessPlaybackPause, false)
        this.getAudio.addEventListener('emptied', this.proccessPlaybackEmptied, false)
        this.getAudio.addEventListener('ended', this.proccessPlaybackStop, false)
      } else {
        // stop listening
        this.getAudio.removeEventListener('loadeddata', this.proccessPlaybackStart, false)
        this.getAudio.removeEventListener('timeupdate', this.proccessPlaybackTimeUpdate, false)
        this.getAudio.removeEventListener('pause', this.proccessPlaybackPause, false)
        this.getAudio.removeEventListener('emptied', this.proccessPlaybackEmptied, false)
        this.getAudio.removeEventListener('ended', this.proccessPlaybackStop, false)
      }
    },

    // when first frame of media has finished loading
    proccessPlaybackStart() {
      // update UI
      this.changePlayerIsLoading(false)
      this.changePlayerIsPlaying(true)
      this.changePlayerIsPaused(false)
      this.changePlayerIsStopped(false)
      
      this.changeCurrentTrackDuration(this.getAudio.duration) // get track duration

    },

    // when time indicated by the currentTime attribute has been updated
    proccessPlaybackTimeUpdate() {
      // check if track duration is NaN or zero and rectify
      if(isNaN(this.getCurrentTrackDuration) || !isFinite(this.getCurrentTrackDuration)){
          this.changeCurrentTrackDuration(260) // give reasonable track duration
      }  else {
          this.changeCurrentTrackDuration((isNaN(this.getAudio.duration) || !isFinite(this.getAudio.duration)) ? 260 : this.getAudio.duration) // get track duration
      }
      // debug loading
      if(this.getPlayerIsLoading){
          this.changePlayerIsLoading(false)
      }

      // update UI
      this.changeCurrentTrackTime(this.getAudio.currentTime) // get current track time

      this.changePlayerIsPlaying(true)
      this.changePlayerIsPaused(false)
      this.changePlayerIsStopped(false)
    },

    // called when element is paused
    proccessPlaybackPause() {
      // update UI
      this.changePlayerIsPlaying(false)
      this.changePlayerIsPaused(true)
      this.changePlayerIsStopped(false)
    },

    // called when loaded() is called
    proccessPlaybackEmptied() {
      // kill all event listeners
      this.getAudio.removeEventListener('loadeddata', this.proccessPlaybackStart, false)
      this.getAudio.removeEventListener('timeupdate', this.proccessPlaybackTimeUpdate, false)
      this.getAudio.removeEventListener('pause', this.proccessPlaybackEmptied, false)
      // update times
      this.changeCurrentTrackTime(0)
      this.changeCurrentTrackDuration(0)
      
      // update UI
      this.changePlayerIsPlaying(false)
      this.changePlayerIsPaused(false)
      this.changePlayerIsStopped(true)
    },

    // when playback stops at the end of the media
    proccessPlaybackStop() {
      // kill all event listeners
      this.getAudio.removeEventListener('loadeddata', this.proccessPlaybackStart, false)
      this.getAudio.removeEventListener('timeupdate', this.proccessPlaybackTimeUpdate, false)
      this.getAudio.removeEventListener('pause', this.proccessPlaybackPause, false)
      // update times
      this.changeCurrentTrackTime(0)
      this.changeCurrentTrackDuration(0)

      // update UI
      this.changePlayerIsPlaying(false)
      this.changePlayerIsPaused(false)
      this.changePlayerIsStopped(true)

      // check if continuous playback is true
      if(this.getContinuousPlaybackStatus){
        // check if there's a next track on the playlist
        if((this.getCurrentTrackId + 1) <= (this.getSongsCount - 1)){
          // play next song
          this.changePlayerIsLoading(true)  // show player loading animation on UI
          this.changeCurrentTrackId(this.getCurrentTrackId + 1) // update current track id
          this.playCurrentSong() // play audio
        } else {
          // play first track
          this.changePlayerIsLoading(true)  // show player loading animation on UI
          this.changeCurrentTrackId(0) // update current track id
          this.playCurrentSong() // play audio
        }
      }
    },
    ...mapActions({
      updatePlaylist: 'updatePlaylist',
      playTrack: 'play',
      stop: 'stop',
      pause: 'pause',
      nextSong: 'next',
      prevSong: 'previous',
      changeContinuousPlay: 'changeContinuousPlay',
      changeCurrentTrackTime: 'changeCurrentTrackTime',
      changeCurrentTrackDuration: 'changeCurrentTrackDuration',
      changePlayerIsLoading: 'changePlayerIsLoading',
      changePlayerIsPlaying: 'changePlayerIsPlaying',
      changePlayerIsPaused: 'changePlayerIsPaused',
      changePlayerIsStopped: 'changePlayerIsStopped',
      changeCurrentTrackId: 'changeCurrentTrackId',
      changeVolume: 'changeVolume',
      seekToTime: 'seek',
    }),
  }
}

export default PlayerMixin
