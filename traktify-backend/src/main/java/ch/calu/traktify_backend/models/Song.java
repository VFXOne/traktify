package ch.calu.traktify_backend.models;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table
public class Song {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String spotifyID;
    private String name;
    private String artists; //TODO Model Artist
    private int duration_ms;
    private String camelotKey; //TODO Model CamelotKey
    private int tempo;
    private int acousticness;

    public String getSpotifyID() {
        return spotifyID;
    }

    public void setSpotifyID(String spotifyID) {
        this.spotifyID = spotifyID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getArtists() {
        return artists;
    }

    public void setArtists(String artists) {
        this.artists = artists;
    }

    public int getDuration_ms() {
        return duration_ms;
    }

    public void setDuration_ms(int duration_ms) {
        this.duration_ms = duration_ms;
    }

    public String getCamelotKey() {
        return camelotKey;
    }

    public void setCamelotKey(String camelotKey) {
        this.camelotKey = camelotKey;
    }

    public int getTempo() {
        return tempo;
    }

    public void setTempo(int tempo) {
        this.tempo = tempo;
    }

    public int getAcousticness() {
        return acousticness;
    }

    public void setAcousticness(int acousticness) {
        this.acousticness = acousticness;
    }

    public int getDanceability() {
        return danceability;
    }

    public void setDanceability(int danceability) {
        this.danceability = danceability;
    }

    public int getEnergy() {
        return energy;
    }

    public void setEnergy(int energy) {
        this.energy = energy;
    }

    public int getValence() {
        return valence;
    }

    public void setValence(int valence) {
        this.valence = valence;
    }

    public List<Playlist> getPlaylists() {
        return playlists;
    }

    public void setPlaylists(List<Playlist> playlists) {
        this.playlists = playlists;
    }

    private int danceability;
    private int energy;
    private int valence;

    @ManyToMany(mappedBy = "songList")
    private List<Playlist> playlists;
}