package ch.calu.traktify_backend.services;

import ch.calu.traktify_backend.models.Playlist;
import ch.calu.traktify_backend.models.Song;
import ch.calu.traktify_backend.models.dto.DTOMapper;
import ch.calu.traktify_backend.models.dto.PlaylistDTO;
import ch.calu.traktify_backend.repositories.PlaylistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.model_objects.specification.PlaylistSimplified;

import java.util.ArrayList;
import java.util.List;

@Service
public class PlaylistService {

    @Autowired
    PlaylistRepository playlistRepository;

    @Autowired
    SongService songService;

    public void syncPlaylists() {
        List<Playlist> storedPlaylists = playlistRepository.findAll();

        if (storedPlaylists.isEmpty()) {
            List<Playlist> playlistsFromSpotify = getPlaylistsFromSpotify();
            playlistRepository.saveAll(playlistsFromSpotify);
        }

    }

    public PlaylistDTO[] getAllPlaylists() {
        List<Playlist> playlists = playlistRepository.findAll();
        PlaylistDTO[] playlistDTOs = new PlaylistDTO[playlists.size()];

        for (int i = 0; i < playlists.size(); i++) {
            Playlist playlist = playlists.get(i);
            PlaylistDTO playlistDTO = DTOMapper.INSTANCE.toPlaylistDTO(playlist);
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
        List<Playlist> playlistList = new ArrayList<>();

        List<PlaylistSimplified> list = PagingRequestHelper.getAllElements((offset) -> SpotifyService.getApi().getListOfCurrentUsersPlaylists().offset(offset).build());
        for (final PlaylistSimplified spotifyPlaylist : list) {
            if (spotifyPlaylist.getOwner().getId().equals(SpotifyService.getUserID())) {
                Playlist playlist = new Playlist();
                playlist.setSpotifyID(spotifyPlaylist.getId());
                playlist.setName(spotifyPlaylist.getName());

                playlistList.add(playlist);
            }
        }

        return playlistList;
    }
}
