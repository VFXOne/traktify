package ch.calu.traktify_backend.services;

import ch.calu.traktify_backend.models.db.Playlist;
import ch.calu.traktify_backend.models.db.Song;
import ch.calu.traktify_backend.repositories.SongRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
            songRepository.findBySpotifyID(song.getSpotifyID()).ifPresent(existingSong -> song.setPlaylists(existingSong.getPlaylists()));
            song.addPlaylist(playlistToFill);
        }

        playlistToFill.setSongList(songList.isEmpty() ? null : songList);
    }

    @Transactional
    public void deleteSongFromPlaylist(String spotifyId, String playlistId) {
        Optional<Song> song = songRepository.findBySpotifyID(spotifyId);
        song.ifPresent(s -> {
            //Si la chanson n'est que dans cette playlist, on supprime la chanson de la DB. Autrement, on supprime juste la playlist de la liste.
            if (s.getPlaylists().stream().allMatch(p -> p.getSpotifyID().equals(playlistId))) {
                songRepository.delete(s);
            } else {
                s.getPlaylists().removeIf(p -> p.getSpotifyID().equals(playlistId));
            }
        });
    }
}
