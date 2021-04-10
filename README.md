# xns-audio-player

> A persistent audio player powered by vue and some visuals from [tailwindcss](https://github.com/tailwindcss/tailwindcss), [v-tooltip](https://github.com/Akryum/v-tooltip), [v-progress](https://github.com/MissHoya/v-progress), [vue-ionicons](https://mazipan.github.io/vue-ionicons) & [xns-seek-bar](https://github.com/xinnks/xns-seek-bar)

## [Demo](https://xns-audio-player.netlify.com/ "Demo")

![xns-audio-player](https://res.cloudinary.com/djx5h4cjt/image/upload/cs_tinysrgb,fl_force_strip,q_51/v1616683528/xns-audio-player/xap-m-p.gif)


## Adding playlists
To add a new playlist call the __addPlaylist()__ method from within a method or the mounted hook
```jsx
    ...
        this.addPlaylist({
            title: 'Playlist 1',
            songs: this.demoPlaylist
        })
    ...
```
Where `demoPlaylist` is an array of song objects in the following format
```js
{ audio: "link_to_audio_file.mp3", artist: "Artist's name", title: "Song title", album: "album name", cover: "link_to_album_or_song_cover_image.jpg"}
```


[![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/default-orange.png)](https://www.buymeacoffee.com/Xinnks)


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
