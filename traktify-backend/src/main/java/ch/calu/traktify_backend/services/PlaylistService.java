package ch.calu.traktify_backend.services;

import ch.calu.traktify_backend.models.Playlist;
import ch.calu.traktify_backend.models.Song;
import ch.calu.traktify_backend.models.dto.DTOMapper;
import ch.calu.traktify_backend.models.dto.PlaylistDTO;
import ch.calu.traktify_backend.repositories.PlaylistRepository;
import org.apache.hc.core5.http.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.PlaylistSimplified;
import se.michaelthelin.spotify.requests.data.playlists.GetListOfCurrentUsersPlaylistsRequest;

import java.io.IOException;
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
        return playlist.getSongList();
    }

    private List<Playlist> getPlaylistsFromSpotify() {
        List<Playlist> playlistList = new ArrayList<>();

        int offset = 0;
        int count = 0;
        int total = Integer.MAX_VALUE;

        while (count < total) {
            final GetListOfCurrentUsersPlaylistsRequest playlistRequest = SpotifyService.getApi().getListOfCurrentUsersPlaylists()
                    .offset(offset)
                    .build();

            try {
                final Paging<PlaylistSimplified> spotifyPlaylists = playlistRequest.execute();

                int playlistsInRequest = spotifyPlaylists.getLimit();
                count += playlistsInRequest;
                offset += playlistsInRequest;
                total = spotifyPlaylists.getTotal();

                for (final PlaylistSimplified spotifyPlaylist : spotifyPlaylists.getItems()) {
                    if (spotifyPlaylist.getOwner().getId().equals(SpotifyService.getUserID())) {
                        Playlist playlist = new Playlist();
                        playlist.setSpotifyID(spotifyPlaylist.getId());
                        playlist.setName(spotifyPlaylist.getName());

                        playlistList.add(playlist);
                    }
                }
            }
            catch (IOException | SpotifyWebApiException | ParseException e) {
                throw new RuntimeException(e);
            }
        }

        return playlistList;
    }
}
