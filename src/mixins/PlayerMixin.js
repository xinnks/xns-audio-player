import {mapGetters, mapActions, mapState} from 'vuex'
import MediaSessionApiMixin from './MediaSessionApiMixin'
import PlaybackMixin from './PlaybackMixin'
const PlayerMixin = {
  mixins: [MediaSessionApiMixin, PlaybackMixin],
  data(){
    return {
      progressColor: "#21FB92",
      progressBgColor: "#ffffff",
      hidePlayer: true, // for persistent player
      progressHeightMain: 8,
      volumeHeightMain: 8,
      progressHeightPersistent: 15,
      volumeHeightPersistent: 5,
      fixedSkipTime: 10
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
    ...mapGetters(['getAudio', 'getSongs', 'getSongsCount', 'getVolume', 'getCurrentTrackId', 'getCurrentTrackTime', 'getCurrentTrackDuration', 'getPlayerIsLoading', 'getPlayerIsPlaying', 'getPlayerIsPaused', 'getPlayerIsStopped', 'getContinuousPlaybackStatus', 'getCurrentTrackId', 'getMediaSessionAPI'])
  },
  mounted(){
    if(this.getMediaSessionAPI.support){
      navigator.mediaSession.setActionHandler('play', () => { this.playCurrentSong() });
      navigator.mediaSession.setActionHandler('pause', () => { this.pauseSong() });
      navigator.mediaSession.setActionHandler('stop', () => { this.stop() });
      navigator.mediaSession.setActionHandler('seekbackward', () => { this.seekPlayer(Math.max(this.activePlayer.currentTrackTime - this.fixedSkipTime, 0)) });
      navigator.mediaSession.setActionHandler('seekforward', () => { this.seekPlayer(Math.min(this.activePlayer.currentTrackTime + this.fixedSkipTime, this.activePlayer.currentTrackDuration)) });
      navigator.mediaSession.setActionHandler('previoustrack', () => { this.playPrevSong() });
      navigator.mediaSession.setActionHandler('nexttrack', () => { this.playNextSong() });
    }
  },
  methods: {
    audioListening(listen = true){
      if(listen){
        // start listening
        this.getAudio(this.activePlayer.position).addEventListener('loadeddata', this.proccessPlaybackStart, false)
        this.getAudio(this.activePlayer.position).addEventListener('timeupdate', this.proccessPlaybackTimeUpdate, false)
        this.getAudio(this.activePlayer.position).addEventListener('pause', this.proccessPlaybackPause, false)
        this.getAudio(this.activePlayer.position).addEventListener('emptied', this.proccessPlaybackEmptied, false)
        this.getAudio(this.activePlayer.position).addEventListener('ended', this.proccessPlaybackStop, false)
      } else {
        // stop listening
        this.getAudio(this.activePlayer.position).removeEventListener('loadeddata', this.proccessPlaybackStart, false)
        this.getAudio(this.activePlayer.position).removeEventListener('timeupdate', this.proccessPlaybackTimeUpdate, false)
        this.getAudio(this.activePlayer.position).removeEventListener('pause', this.proccessPlaybackPause, false)
        this.getAudio(this.activePlayer.position).removeEventListener('emptied', this.proccessPlaybackEmptied, false)
        this.getAudio(this.activePlayer.position).removeEventListener('ended', this.proccessPlaybackStop, false)
      }
    },

    // when first frame of media has finished loading
    proccessPlaybackStart() {
      // update UI
      this.changePlayerIsLoading({playerPosition: this.activePlayer.position, status: false})
      this.changePlayerIsPlaying({playerPosition: this.activePlayer.position, status: true})
      this.changePlayerIsPaused({playerPosition: this.activePlayer.position, status: false})
      this.changePlayerIsStopped({playerPosition: this.activePlayer.position, status: false})
      
      this.changeCurrentTrackDuration(this.getAudio(this.activePlayer.position).duration) // get track duration

      // update active player
      this.updateActivePlayer({playerPosition: this.activePlayer.position})
    },

    // when time indicated by the currentTime attribute has been updated
    proccessPlaybackTimeUpdate() {
      // check if track duration is NaN or zero and rectify
      if(isNaN(this.getCurrentTrackDuration(this.activePlayer.position)) || !isFinite(this.getCurrentTrackDuration(this.activePlayer.position))){
          this.changeCurrentTrackDuration({playerPosition: this.activePlayer.position, time: 260}) // give reasonable track duration
      }  else {
          this.changeCurrentTrackDuration({playerPosition: this.activePlayer.position, time: (isNaN(this.getAudio(this.activePlayer.position).duration) || !isFinite(this.getAudio(this.activePlayer.position).duration)) ? 260 : this.getAudio(this.activePlayer.position).duration}) // get track duration
      }
      // debug loading
      if(this.getPlayerIsLoading){
          this.changePlayerIsLoading({playerPosition: this.activePlayer.position, status: false})
      }

      // update UI
      this.changeCurrentTrackTime({playerPosition: this.activePlayer.position, time: this.getAudio(this.activePlayer.position).currentTime}) // get current track time

      this.changePlayerIsPlaying({playerPosition: this.activePlayer.position, status: true})
      this.changePlayerIsPaused({playerPosition: this.activePlayer.position, status: false})
      this.changePlayerIsStopped({playerPosition: this.activePlayer.position, status: false})

      // update active player
      this.updateActivePlayer({playerPosition: this.activePlayer.position})
    },

    // called when element is paused
    proccessPlaybackPause() {
      // update UI
      this.changePlayerIsPlaying({playerPosition: this.activePlayer.position, status: false})
      this.changePlayerIsPaused({playerPosition: this.activePlayer.position, status: true})
      this.changePlayerIsStopped({playerPosition: this.activePlayer.position, status: false})

      // update active player
      this.updateActivePlayer({playerPosition: this.activePlayer.position})
    },

    // called when loaded() is called
    proccessPlaybackEmptied() {
      // kill all event listeners
      this.getAudio(this.activePlayer.position).removeEventListener('loadeddata', this.proccessPlaybackStart, false)
      this.getAudio(this.activePlayer.position).removeEventListener('timeupdate', this.proccessPlaybackTimeUpdate, false)
      this.getAudio(this.activePlayer.position).removeEventListener('pause', this.proccessPlaybackEmptied, false)
      // update times
      this.changeCurrentTrackTime({playerPosition: this.activePlayer.position, time: 0})
      this.changeCurrentTrackDuration({playerPosition: this.activePlayer.position, time: 0})
      
      // update UI
      this.changePlayerIsPlaying({playerPosition: this.activePlayer.position, status: false})
      this.changePlayerIsPaused({playerPosition: this.activePlayer.position, status: false})
      this.changePlayerIsStopped({playerPosition: this.activePlayer.position, status: true})

      // update active player
      this.updateActivePlayer({playerPosition: this.activePlayer.position})
    },

    // when playback stops at the end of the media
    proccessPlaybackStop() {
      // kill all event listeners
      this.getAudio(this.activePlayer.position).removeEventListener('loadeddata', this.proccessPlaybackStart, false)
      this.getAudio(this.activePlayer.position).removeEventListener('timeupdate', this.proccessPlaybackTimeUpdate, false)
      this.getAudio(this.activePlayer.position).removeEventListener('pause', this.proccessPlaybackPause, false)
      // update times
      this.changeCurrentTrackTime({playerPosition: this.activePlayer.position, time: 0})
      this.changeCurrentTrackDuration({playerPosition: this.activePlayer.position, time: 0})

      // update UI
      this.changePlayerIsPlaying({playerPosition: this.activePlayer.position, status: false})
      this.changePlayerIsPaused({playerPosition: this.activePlayer.position, status: false})
      this.changePlayerIsStopped({playerPosition: this.activePlayer.position, status: true})

      // check if continuous playback is true
      if(this.getContinuousPlaybackStatus(this.activePlayer.position)){
        // check if there's a next track on the playlist
        if((this.activePlayer.getCurrentTrackId + 1) <= (this.getSongsCount - 1)){
          // play next song
          this.changePlayerIsLoading({playerPosition: this.activePlayer.position, status: true})  // show player loading animation on UI
          this.changeCurrentTrackId(this.activePlayer.getCurrentTrackId + 1) // update current track id
          this.playCurrentSong() // play audio
        } else {
          // play first track
          this.changePlayerIsLoading({playerPosition: this.activePlayer.position, status: true})  // show player loading animation on UI
          this.changeCurrentTrackId({playerPosition: this.activePlayer.position, time: 0}) // update current track id
          this.playCurrentSong() // play audio
        }
      }

      // update active player
      this.updateActivePlayer({playerPosition: this.activePlayer.position})
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
      updateActivePlayer: 'updateActivePlayer',
      UpdateMediaSessionAPI: 'UpdateMediaSessionAPI',
    }),
  }
}

export default PlayerMixin
