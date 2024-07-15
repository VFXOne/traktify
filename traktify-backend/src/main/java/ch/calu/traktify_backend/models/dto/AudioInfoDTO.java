package ch.calu.traktify_backend.models.dto;

public record AudioInfoDTO(
        String camelotKey,
        int tempo,
        int acousticness,
        int danceability,
        int energy,
        int valence
) {
}
