package ch.calu.traktify_backend.models.dto;

public record SongDTO(
        String spotifyID,
        String name,
        String artists,
        int duration_ms,
        String camelotKey,
        int tempo,
        int acousticness,
        int danceability,
        int energy,
        int valence
) {
}
