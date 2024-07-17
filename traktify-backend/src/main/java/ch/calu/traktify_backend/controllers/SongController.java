package ch.calu.traktify_backend.controllers;

import ch.calu.traktify_backend.models.Song;
import ch.calu.traktify_backend.models.dto.DTOMapper;
import ch.calu.traktify_backend.models.dto.SongDTO;
import ch.calu.traktify_backend.services.PlaylistService;
import ch.calu.traktify_backend.services.SongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4202")
@RequestMapping("backend")
public class SongController {

    @Autowired
    private PlaylistService playlistService;
    @Autowired
    private SongService songService;

    @GetMapping("songs/{playlistID}")
    public SongDTO[] getSongsFromPlaylist(@PathVariable("playlistID") String playlistID) {
        List<Song> songList = playlistService.getSongsFromPlaylist(playlistID);
        List<SongDTO> songDTOList = DTOMapper.INSTANCE.toSongDTOList(songList);

        return songDTOList.toArray(new SongDTO[0]);
    }

    @GetMapping("song/{id}")
    public SongDTO getSong(@PathVariable String id) {
        Song songFound = songService.getSongFromPlaylist(id);

        return DTOMapper.INSTANCE.toSongDTO(songFound);
    }
}
