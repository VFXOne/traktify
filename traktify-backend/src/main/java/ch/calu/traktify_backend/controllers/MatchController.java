package ch.calu.traktify_backend.controllers;

import ch.calu.traktify_backend.models.Song;
import ch.calu.traktify_backend.models.dto.DTOMapper;
import ch.calu.traktify_backend.models.dto.SongDTO;
import ch.calu.traktify_backend.services.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4202")
@RequestMapping("/backend")
public class MatchController {

    @Autowired
    MatchService matchService;

    @PutMapping("match/{songid}")
    public List<SongDTO> getMatches(@PathVariable("songid") String songID, @RequestBody List<String> playlistIDs) {
        List<Song> songs = matchService.getMatchesFromPlaylists(songID, playlistIDs);

        return DTOMapper.INSTANCE.toSongDTOList(songs);
    }
}
