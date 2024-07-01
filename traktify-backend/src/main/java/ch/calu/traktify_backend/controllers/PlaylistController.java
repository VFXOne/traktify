package ch.calu.traktify_backend.controllers;

import ch.calu.traktify_backend.services.PlaylistService;
import ch.calu.traktify_backend.models.dto.PlaylistDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:4202")
@RequestMapping("backend")
public class PlaylistController {

    @Autowired
    PlaylistService playlistService;

    @GetMapping("playlists")
    public PlaylistDTO[] getPlaylists() {
        playlistService.syncPlaylists();
        return playlistService.getAllPlaylists();
    }
}
