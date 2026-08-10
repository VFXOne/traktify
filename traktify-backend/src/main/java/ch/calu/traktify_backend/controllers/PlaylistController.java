package ch.calu.traktify_backend.controllers;

import ch.calu.traktify_backend.models.dto.PlaylistDisplayDTO;
import ch.calu.traktify_backend.models.dto.PlaylistWithSongsDTO;
import ch.calu.traktify_backend.models.dto.SynchronizablePlaylistDTO;
import ch.calu.traktify_backend.services.PlaylistService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4202")
@RequestMapping("/backend")
public class PlaylistController {

    final PlaylistService playlistService;

    public PlaylistController(PlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    @GetMapping("emptyPlaylists")
    public PlaylistDisplayDTO[] getEmptyPlaylists() {
        return playlistService.getAllPlaylistsWithoutSongs();
    }

    @GetMapping("playlistSongs/{playlistId}")
    public PlaylistWithSongsDTO getPlaylistsFilled(@PathVariable String playlistId) {
        return playlistService.getPlaylistWithSongs(playlistId);
    }

    @GetMapping("spotifyPlaylists")
    public SynchronizablePlaylistDTO[] getSpotifyPlaylists() {
        return playlistService.getSynchronizablePlaylists();
    }

    @PutMapping("syncPlaylist/{playlistId}")
    public boolean synchronizePlaylist(@PathVariable String playlistId) {
        return playlistService.syncPlaylistWithSpotify(playlistId);
    }

    @PutMapping("unsyncPlaylist/{playlistId}")
    public boolean unsynchronizePlaylist(@PathVariable String playlistId) {
        return playlistService.unsyncPlaylist(playlistId);
    }
}
