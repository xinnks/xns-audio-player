import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  namespaced: false,
  state: {
    // audio tracks list
    playlists: [],
    activePlaylist: {},

    // player element
    players: [],
    activePlayer: {},
    playerObjectAnatomy: {
      //bools - playback helpers
      isPlaying: false,
      isPaused: false,
      isStopped: false,
      isFirstTrack: true,
      isMuted: false,
      playerIsLoading: false,
      continuousPlaybackStatus: false,
      // player element
      audio: new Audio(),
      // player properties
      volume: 0.5,
      buffered: 0,
      // custom helper properties
      currentTrackId: 0,
      currentTrackTime: 0,
      currentTrackDuration: 0,
    }
  },

  getters: {
    getSongs: (state) => (playlistPosition) => state.playlists[playlistPosition].songs,
    getSongsCount: (state) => (playlistPosition) => state.playlists[playlistPosition].count,
    getAudio: (state) => (playerPosition) => state.players[playerPosition].audio,
    getVolume: (state) => (playerPosition) => state.players[playerPosition].volume,
    getCurrentTrackId: (state) => (playerPosition) => state.players[playerPosition].currentTrackId,
    getCurrentTrackTime: (state) => (playerPosition) => state.players[playerPosition].currentTrackTime,
    getCurrentTrackDuration: (state) => (playerPosition) => state.players[playerPosition].currentTrackDuration,
    getPlayerIsLoading: (state) => (playerPosition) => state.players[playerPosition].playerIsLoading,
    getPlayerIsPlaying: (state) => (playerPosition) => state.players[playerPosition].isPlaying,
    getPlayerIsPaused: (state) => (playerPosition) => state.players[playerPosition].isPaused,
    getPlayerIsStopped: (state) => (playerPosition) => state.players[playerPosition].isStopped,
    getContinuousPlaybackStatus: (state) => (playerPosition) => state.players[playerPosition].continuousPlaybackStatus,
  },

  mutations: {
    updatePlaylistSongs(state, payload){
      state.playlists[payload.playlistPosition].songs = payload.songs
      state.playlists[payload.playlistPosition].count = state.playlists[payload.playlistPosition].songs.length
    },
    async addPlaylist(state, payload){ // {title, songs}
      if(payload.songs){ // check if playlist to be added has songs
        await state.playlists.push({
          title: payload.title || `playlist ${state.playlists.length + 1}`,
          songs: payload.songs,
          count: payload.songs.length
        })
        // update player objects
        await state.players.push(state.playerObjectAnatomy)

        // add active player & playlist
        state.activePlaylist = {position: 0, ...state.playlists[0]}
        state.activePlayer = {position: 0, ...state.players[0]}
      } else {
        console.log("Playlist has no songs, you can not add an empty playlist")
      }
    },
    removePlaylist(state, payload){
      if(state.playlists.length > 0){ // check if at least one playlist exists
        // if position is not specified remove the last added playlist
        if(payload.playlistPosition !== undefined){
          state.playlists.splice(payload.playlistPosition, 0)
          state.players.splice(payload.playlistPosition, 0)
        } else {
          state.playlists.pop()
          this.players.pop()
        }
      }
    },
    },
    updateContinuousPlaybackStatus(state, payload){
      state.continuousPlaybackStatus = payload.status
    },
    updateCurrentTrackId(state, payload){
      state.currentTrackId = payload.trackId
    },
    updateCurrentTrackTime(state, payload){
      state.currentTrackTime = payload.time
    },
    updateCurrentTrackDuration(state, payload){
      state.currentTrackDuration = payload.time
    },
    updatePlayerVolume(state, payload){
      // Change volume
      state.volume = payload.volume
      state.audio.volume = payload.volume
    },
    updatePlayerIsLoading(state, payload) {
      state.playerIsLoading = payload.status
    },
    updatePlayerIsPlaying(state, payload) {
      state.isPlaying = payload.status
    },
    updatePlayerIsPaused(state, payload) {
      state.isPaused = payload.status
    },
    updatePlayerIsStopped(state, payload) {
      state.isStopped = payload.status
    },
    playTrack(state, payload){
      // if currentTrackTime is not 0, resume play
      if((state.currentTrackTime !== 0) && state.isPaused){
        state.audio.play()
      } else {
        // abort current player progress
        state.audio.load()
        
        state.playerIsLoading = true // show player loading animation on UI

        state.currentTrackId = payload.trackId === 0 || payload.trackId ? payload.trackId : state.currentTrackId // update current track id
        state.audio.src = state.songs[state.currentTrackId].audio
        state.audio.play() // play audio
      }
      state.audio.volume = state.volume
    },
    pauseTrack(state){
      state.audio.pause()
    },
    stopTrack(state){
      state.audio.load()
    },
    seekPlayer(state, payload){
      // seek to time
      state.audio.currentTime = payload.time
    },
  },

  actions: {
    updatePlaylist({commit}, songs){
      return commit('updateSongs',{songs: songs});
    },
    play({commit}, trackId = null){
      return commit('playTrack',{trackId: trackId})
    },
    pause({commit}){
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('pauseTrack');
          resolve()
        }, 10)
      })
    },
    stop({commit}, trackId){
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('stopTrack',{trackId: trackId});
          resolve()
        }, 10)
      })
    },
    seek({commit}, time){
      return commit('seekPlayer',{time: time});
    },
    next({commit, state}){
      // check if there's a next track on the playlist
      if((state.currentTrackId + 1) <= (state.songsCount - 1)){
        // play next song
        commit('updateCurrentTrackId',{trackId: (state.currentTrackId + 1)})
        setTimeout(() => {
          commit('playTrack', {trackId: state.currentTrackId});
        }, 10)
      } else {
        // check if continuous playback is true
        // TODO convert this, to repeat all check instead
        if(state.continuousPlaybackStatus){
          // play first track
          commit('updateCurrentTrackId',{trackId: 0})
          setTimeout(() => {
            commit('playTrack', {trackId: state.currentTrackId});
          }, 10)
        } else {
            // Reached end of playlist
        }
      }
    },
    previous({commit, state}){
      // check if there's a previous track on the playlist
      if((state.currentTrackId - 1) >= 0){
        // play previous song
        commit('updateCurrentTrackId',{trackId: (state.currentTrackId - 1)})
        setTimeout(() => {
          commit('playTrack', {trackId: state.currentTrackId});
        }, 10)
      } else {
        // check if continuous playback is true
        // TODO convert this, to repeat all check instead
        if(state.continuousPlaybackStatus){
          // play last song
          commit('updateCurrentTrackId',{trackId: (state.songsCount - 1)})
          setTimeout(() => {
            commit('playTrack', {trackId: state.currentTrackId});
          }, 10)
        } else {
          // Reached start of playlist
        }
      }
    },
    repeat({commit}, trackId){
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('playTrack',{trackId: trackId});
          resolve()
        }, 10)
      })
    },
    changeContinuousPlay({commit}, status){
      return commit('updateContinuousPlaybackStatus',{status: status});
    },
    changeCurrentTrackId({commit}, id){
      return commit('updateCurrentTrackId',{trackId: id});
    },
    changeCurrentTrackTime({commit}, time){
      return commit('updateCurrentTrackTime',{time: time});
    },
    changeCurrentTrackDuration({commit}, time){
      return commit('updateCurrentTrackDuration',{time: time});
    },
    changePlayerIsLoading({commit}, status) {
      commit('updatePlayerIsLoading', {status: status})
    },
    changePlayerIsPlaying({commit}, status) {
      commit('updatePlayerIsPlaying', {status: status})
    },
    changePlayerIsPaused({commit}, status) {
      commit('updatePlayerIsPaused', {status: status})
    },
    changePlayerIsStopped({commit}, status) {
      commit('updatePlayerIsStopped', {status: status})
    },
    changeVolume({commit}, volume) {
      commit('updatePlayerVolume', {volume: volume})
    },
  }
})