import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
/* eslint-disable */
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
    },

    mediaSessionAPI: {support: false, data: {}},
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
    getMediaSessionAPI: (state) => state.mediaSessionAPI,
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
    updateActivePlayer(state, payload){
      state.activePlayer = {position: payload.playerPosition, ...state.players[payload.playerPosition]}
    },
    updateContinuousPlaybackStatus(state, payload){
      state.players[payload.playerPosition].continuousPlaybackStatus = payload.status
    },
    updateCurrentTrackId(state, payload){
      state.players[payload.playerPosition].currentTrackId = payload.trackId
    },
    updateCurrentTrackTime(state, payload){
      state.players[payload.playerPosition].currentTrackTime = payload.time
    },
    updateCurrentTrackDuration(state, payload){
      state.players[payload.playerPosition].currentTrackDuration = payload.time || 0 // set duration to zero when trackTime is undefined(when track hasn't loaded)
    },
    updatePlayerVolume(state, payload){
      // Change volume
      state.players[payload.playerPosition].volume = payload.volume
      state.players[payload.playerPosition].audio.volume = payload.volume
    },
    updatePlayerIsLoading(state, payload) {
      state.players[payload.playerPosition].playerIsLoading = payload.status
    },
    updatePlayerIsPlaying(state, payload) {
      state.players[payload.playerPosition].isPlaying = payload.status
    },
    updatePlayerIsPaused(state, payload) {
      state.players[payload.playerPosition].isPaused = payload.status
    },
    updatePlayerIsStopped(state, payload) {
      state.players[payload.playerPosition].isStopped = payload.status
    },
    playTrack(state, payload){
      // if currentTrackTime is not 0, and if in the same playlist resume play
      if((state.players[payload.playerPosition].currentTrackTime !== 0) && state.players[payload.playerPosition].isPaused && (payload.playerPosition === state.activePlayer.position)){
        state.players[payload.playerPosition].audio.play()
      } else {
        // abort current player progress
        state.players[payload.playerPosition].audio.load()

        state.players[payload.playerPosition].playerIsLoading = true // show player loading animation on UI

        state.players[payload.playerPosition].currentTrackId = payload.trackId === 0 || payload.trackId ? payload.trackId : state.players[payload.playerPosition].currentTrackId // update current track id
        state.players[payload.playerPosition].audio.src = state.playlists[payload.playerPosition].songs[state.players[payload.playerPosition].currentTrackId].audio
        state.players[payload.playerPosition].audio.play() // play audio
      }
      state.players[payload.playerPosition].audio.volume = state.players[payload.playerPosition].volume

      // update activePlaylist
      state.activePlaylist = {position: payload.playerPosition, ...state.playlists[payload.playerPosition]}
      state.activePlayer = {position: payload.playerPosition, ...state.players[payload.playerPosition]}
    },
    pauseTrack(state, payload){
      state.players[payload.playerPosition].audio.pause()
    },
    stopTrack(state, payload){
      state.players[payload.playerPosition].audio.load()
    },
    seekPlayer(state, payload){
      // seek to time
      state.players[payload.playerPosition].audio.currentTime = payload.time
    },
    async updateMediaSessionAPISupport(state, payload){
      state.mediaSessionAPI.support = payload.support;
    },
    async updateMediaSessionAPI(state, payload){
        if(state.mediaSessionAPI.support){
          state.mediaSessionAPI.data = await Object.assign(state.mediaSessionAPI.data, payload.data);
        }else{
          console.log("No Media Session API Support");
        }
    },
    updateNavigatorMetadataForMediaSessionAPI(state, payload){
      navigator.mediaSession.metadata = new MediaMetadata(payload);
    }
  },

  actions: {
    updatePlaylist({commit}, payload){
      return commit('updatePlaylistSongs',{payload: payload});
    },
    addPlaylist({commit}, payload){
      return commit('addPlaylist', payload)
    },
    play({commit}, payload){
      return commit('playTrack', payload) // {playerPosition
    },
    pause({commit}, payload){
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('pauseTrack', payload); // { playerPosition
          resolve()
        }, 10)
      })
    },
    stop({state, commit}){
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('stopTrack', {playerPosition: state.activePlayer.position}); // {playerPosition }
          resolve()
        }, 10)
      })
    },
    seek({state, commit, dispatch}, payload){
      return dispatch('registerSeek', payload)
        .then(() => {
          commit('updateActivePlayer', {playerPosition: state.activePlayer.position})
        })
    },
    registerSeek({commit}, payload){
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('seekPlayer', payload); // {playerPosition, time}
          resolve()
        }, 10)
      })
    },
    next({commit, state}, payload){ // {playerPosition}
      // check if there's a next track on the playlist
      if((state.players[payload.playerPosition].currentTrackId + 1) <= (state.playlists[payload.playerPosition].count - 1)){
        // play next song
        commit('updateCurrentTrackId',{trackId: (state.players[payload.playerPosition].currentTrackId + 1), ...payload})
        setTimeout(() => {
          commit('playTrack', {trackId: state.players[payload.playerPosition].currentTrackId, ...payload});
        }, 10)
      } else {
        // check if continuous playback is true
        // TODO convert this, to repeat all check instead
        if(state.players[payload.playerPosition].continuousPlaybackStatus){
          // play first track
          commit('updateCurrentTrackId',{trackId: 0, ...payload})
          setTimeout(() => {
            commit('playTrack', {trackId: state.players[payload.playerPosition].currentTrackId, ...payload});
          }, 10)
        } else {
            // Reached end of playlist
        }
      }
    },
    previous({commit, state}, payload){ // {playerPosition, playlistPosition}
      // check if there's a previous track on the playlist
      if((state.players[payload.playerPosition].currentTrackId - 1) >= 0){
        // play previous song
        commit('updateCurrentTrackId',{trackId: (state.players[payload.playerPosition].currentTrackId - 1), ...payload})
        setTimeout(() => {
          commit('playTrack', {trackId: state.players[payload.playerPosition].currentTrackId, ...payload});
        }, 10)
      } else {
        // check if continuous playback is true
        // TODO convert this, to repeat all check instead
        if(state.players[payload.playerPosition].continuousPlaybackStatus){
          // play last song
          commit('updateCurrentTrackId',{trackId: (state.playlists[payload.playlistPosition].count - 1), ...payload})
          setTimeout(() => {
            commit('playTrack', {trackId: state.players[payload.playerPosition].currentTrackId, ...payload});
          }, 10)
        } else {
          // Reached start of playlist
        }
      }
    },
    repeat({commit}, payload){ // {trachId, playerPosition}
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('playTrack', payload);
          resolve()
        }, 10)
      })
    },
    changeContinuousPlay({state, commit}, payload){ // {playerPosition, status}
      return commit('updateContinuousPlaybackStatus', {playerPosition: state.activePlayer.position, status: payload});
    },
    changeCurrentTrackId({commit}, payload){ // {playerPosition, trackId}
      return commit('updateCurrentTrackId', payload);
    },
    changeCurrentTrackTime({commit}, payload){ // {playerPosition, time}
      return commit('updateCurrentTrackTime', payload);
    },
    changeCurrentTrackDuration({commit}, payload){ // {playerPosition, time}
      return commit('updateCurrentTrackDuration', payload);
    },
    changePlayerIsLoading({commit}, payload) { // {playerPosition, status}
      commit('updatePlayerIsLoading', payload)
    },
    changePlayerIsPlaying({commit}, payload) { // {playerPosition, status}
      commit('updatePlayerIsPlaying', payload)
    },
    changePlayerIsPaused({commit}, payload) { // {playerPosition, status}
      commit('updatePlayerIsPaused', payload)
    },
    changePlayerIsStopped({commit}, payload) { // {playerPosition, status}
      commit('updatePlayerIsStopped', payload)
    },
    changeVolume({state, commit}, payload) { // {playerPosition, volume}
      commit('updatePlayerVolume', {playerPosition: state.activePlayer.position, volume: payload})
    },
    updateActivePlayer({commit}, payload){
      return commit('updateActivePlayer', payload)
    },

    UpdateMediaSessionAPI({commit, state}, payload){
      if(Object.prototype.hasOwnProperty.call(payload, "support") && !state.mediaSessionAPI.support){
        // update Media Session support state
        commit('updateMediaSessionAPISupport', payload);
      } else { // update metadata or display no-support log
        if(state.mediaSessionAPI.support){
          const updateMSA = new Promise((resolve) => {
            setTimeout(() => {
              commit('updateMediaSessionAPI', payload);
              resolve() }, 10)
          });
          updateMSA.then(() => {
            if(state.mediaSessionAPI.support){
              commit('updateNavigatorMetadataForMediaSessionAPI', payload.data);
            }
          })
        }else{
          console.log("NO Media Session Support");
        }
      }
    }
  }
})