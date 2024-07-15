package ch.calu.traktify_backend.models.dto;

import java.util.List;

public record SongDTO(
        int index,
        String id,
        String name,
        List<ArtistDTO> artists,
        int duration_ms,
        AudioInfoDTO audioInfo
) {
}
