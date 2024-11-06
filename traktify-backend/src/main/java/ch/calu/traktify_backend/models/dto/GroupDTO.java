package ch.calu.traktify_backend.models.dto;

import java.util.List;

public record GroupDTO(
        String id,
        String name,
        List<PlaylistDTO> playlists
) {
}
