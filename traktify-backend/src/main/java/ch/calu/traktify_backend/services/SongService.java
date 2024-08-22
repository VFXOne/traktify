package ch.calu.traktify_backend.services;

import ch.calu.traktify_backend.models.Playlist;
import ch.calu.traktify_backend.models.Song;
import ch.calu.traktify_backend.repositories.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SongService {
    @Autowired
    SongRepository songRepository;

    @Autowired
    AudioInfoService audioInfoService;

    @Autowired
    private SpotifyMusicService spotifyMusicService;

    public Song getSongFromPlaylist(String id) {
        return songRepository.findBySpotifyID(id).orElse(null);
    }

    public void fillPlaylistWithSongsFromSpotify(Playlist playlistToFill) {
        List<Song> songList = spotifyMusicService.getSongsFromSpotifyPlaylist(playlistToFill.getSpotifyID());

        for (Song song : songList) {
            song.setPlaylists(List.of(playlistToFill));
            audioInfoService.updateAudioInfo(song);
        }

        playlistToFill.setSongList(songList.isEmpty() ? null : songList);
    }
}
