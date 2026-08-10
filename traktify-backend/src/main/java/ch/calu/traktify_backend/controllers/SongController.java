package ch.calu.traktify_backend.controllers;

import ch.calu.traktify_backend.models.db.Song;
import ch.calu.traktify_backend.models.dto.DTOMapper;
import ch.calu.traktify_backend.models.dto.SongDTO;
import ch.calu.traktify_backend.services.SongService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4202")
@RequestMapping("backend")
public class SongController {

    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    @GetMapping("song/{id}")
    public SongDTO getSong(@PathVariable String id) {
        Song songFound = songService.getSong(id);

        return DTOMapper.INSTANCE.toSongDTO(songFound);
    }
}
