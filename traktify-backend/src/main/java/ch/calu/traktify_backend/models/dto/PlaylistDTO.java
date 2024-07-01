package ch.calu.traktify_backend.models.dto;

import java.util.List;

public record PlaylistDTO(
        String name,
        String spotifyID,
        List<SongDTO> songList
) {
}
