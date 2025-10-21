package ch.calu.traktify_backend.services;

import ch.calu.traktify_backend.models.Playlist;
import ch.calu.traktify_backend.models.Song;
import ch.calu.traktify_backend.repositories.SongRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SongService {

    private final SongRepository songRepository;
    private final AudioInfoService audioInfoService;
    private final SpotifyMusicService spotifyMusicService;

    public SongService(SongRepository songRepository, AudioInfoService audioInfoService, SpotifyMusicService spotifyMusicService) {
        this.songRepository = songRepository;
        this.audioInfoService = audioInfoService;
        this.spotifyMusicService = spotifyMusicService;
    }

    public Song getSong(String id) {
        return songRepository.findBySpotifyID(id).orElse(null);
    }

    public void fillPlaylistWithSongsFromSpotify(Playlist playlistToFill) {
        List<Song> songList = spotifyMusicService.getSongsFromSpotifyPlaylist(playlistToFill.getSpotifyID());
        audioInfoService.updateAudioInfo(songList);

        for (Song song : songList) {
            song.setPlaylists(List.of(playlistToFill)); //TODO gérer les duplicatas quand un titre est dans plusieurs playlists à la fois parce que le service de spotify retourne une nouvelle instance du titre à chaque fois
        }

        playlistToFill.setSongList(songList.isEmpty() ? null : songList);
    }
}
