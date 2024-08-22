package ch.calu.traktify_backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table
public class Settings {
    @Id
    private Long id;

    public static final Long settingsID = 1L;

    private String spotifyApiRefreshToken;

    public String getSpotifyApiRefreshToken() {
        return spotifyApiRefreshToken;
    }

    public void setSpotifyApiRefreshToken(String spotifyApiUserCode) {
        this.spotifyApiRefreshToken = spotifyApiUserCode;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
