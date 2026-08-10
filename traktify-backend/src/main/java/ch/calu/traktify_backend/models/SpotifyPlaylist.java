package ch.calu.traktify_backend.models;

public record SpotifyPlaylist(
        String name,
        String spotifyID,
        Integer size
) {
}
