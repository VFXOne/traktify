package ch.calu.traktify_backend.services;

import ch.calu.traktify_backend.models.Playlist;
import ch.calu.traktify_backend.models.Song;
import ch.calu.traktify_backend.models.dto.DTOMapper;
import ch.calu.traktify_backend.models.dto.PlaylistDTO;
import ch.calu.traktify_backend.repositories.PlaylistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaylistService {

    @Autowired
    PlaylistRepository playlistRepository;

    @Autowired
    SongService songService;
    @Autowired
    private SpotifyMusicService spotifyMusicService;

    public void syncPlaylists() {
        List<Playlist> storedPlaylists = playlistRepository.findAll();

        if (storedPlaylists.isEmpty()) {
            List<Playlist> playlistsFromSpotify = getPlaylistsFromSpotify();
            playlistRepository.saveAll(playlistsFromSpotify);
        }

    }

    /**
     * Retourne une liste de playlist sans les morceaux de chaque playlist.
     * Il faut utiliser la fonction `getSongsFromPlaylist` pour remplir ces listes avec les morceaux.
     * @return Une liste d'objets PlaylistDTO pour le frontend.
     */
    public PlaylistDTO[] getAllPlaylists() {
        List<Playlist> playlists = playlistRepository.findAll();
        PlaylistDTO[] playlistDTOs = new PlaylistDTO[playlists.size()];

        for (int i = 0; i < playlists.size(); i++) {
            Playlist playlist = playlists.get(i);
            PlaylistDTO playlistDTO = DTOMapper.INSTANCE.toPlaylistDTOWithoutSongs(playlist);
            playlistDTOs[i] = playlistDTO;
        }

        return playlistDTOs;
    }

    public List<Song> getSongsFromPlaylist(String playlistID) {
        Playlist playlist = playlistRepository.findBySpotifyID(playlistID).orElseThrow();
        if (playlist.getSongList().isEmpty()) {
            songService.fillPlaylistWithSongsFromSpotify(playlist);
            playlistRepository.save(playlist);
        }
        return playlist.getSongList();
    }

    private List<Playlist> getPlaylistsFromSpotify() {
        return spotifyMusicService.getSpotifyPlaylists();
    }
}
