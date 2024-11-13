package ch.calu.traktify_backend.services;

import ch.calu.traktify_backend.models.AudioInfo;
import ch.calu.traktify_backend.models.Song;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchService {

    private final SongService songService;
    private final PlaylistService playlistService;
    private final AudioInfoService audioInfoService;

    private static final float OPTIMAL_TEMPO_DIFF = 10.0f;
    private static final float TEMPO_SCORE_WEIGHT = 0.5f;
    private static final float CAMELOT_SCORE_WEIGHT = 0.75f;

    public MatchService(SongService songService, PlaylistService playlistService, AudioInfoService audioInfoService) {
        this.songService = songService;
        this.playlistService = playlistService;
        this.audioInfoService = audioInfoService;
    }

    public List<Song> getMatchesFromPlaylists(String songSpotifyID, List<String> playlistIDs) {
        Song songToMatch = songService.getSong(songSpotifyID);
        List<Song> allSongs = getSongsFromPlaylists(playlistIDs);

        return matchSongs(songToMatch, allSongs);
    }

    private List<Song> getSongsFromPlaylists(List<String> playlistIDs) {
        List<Song> songs = new ArrayList<>();
        for (String playlistID : playlistIDs) {
            songs.addAll(playlistService.getSongsFromPlaylist(playlistID));
        }

        return songs;
    }

    /**
     * Cette fonction est le cœur de l'application.
     * C'est autour de ce concept de correspondance entre musiques que le reste de l'interface est construite
     *
     * @param songToMatch La chanson à laquelle il faut trouver des correspondances
     * @param otherSongs  Une liste des chansons qu'il faut trier en fonction de leur correspondance
     * @return La liste de chansons triée par degré de correspondance à la chanson passée en paramètre
     */
    public List<Song> matchSongs(Song songToMatch, List<Song> otherSongs) {
        if (songToMatch.getAudioInfo() == null) {
            audioInfoService.updateAudioInfo(songToMatch);
        }
        otherSongs = otherSongs.stream().filter(s -> !s.getSpotifyID().equals(songToMatch.getSpotifyID())).toList(); //Avoid matching with the input song
        audioInfoService.updateAudioInfo(otherSongs);

        Set<ComparableSong> matchedSongs = computeMatchingScore(songToMatch, new HashSet<>(otherSongs));

        return matchedSongs.stream().sorted(Comparator.comparing(ComparableSong::matchScore).reversed()).map(cs -> cs.song).toList();
    }

    private Set<ComparableSong> computeMatchingScore(Song songToMatch, Set<Song> otherSongs) {
        return otherSongs.stream().map(s -> new ComparableSong(
                getMatchingScore(songToMatch.getAudioInfo(), s.getAudioInfo()),
                s
        )).collect(Collectors.toSet());
    }

    private float getMatchingScore(AudioInfo songToMatch, AudioInfo otherSong) {
        float camelotScore = computeCamelotScore(songToMatch.getCamelotKey(), otherSong.getCamelotKey());
        float tempoScore = computeTempoScore(songToMatch.getTempo(), otherSong.getTempo());

        return camelotScore * CAMELOT_SCORE_WEIGHT + tempoScore * TEMPO_SCORE_WEIGHT;
    }

    private float computeCamelotScore(String camelotKey1, String camelotKey2) {
        if (camelotKey1.equals(camelotKey2)) {
            return 2;
        }
        int key1Length = camelotKey1.length();
        int key1 = Integer.parseInt(camelotKey1.substring(0, key1Length - 1));
        String tone1 = camelotKey1.substring(key1Length - 1, 2);

        int key2Length = camelotKey2.length();
        int key2 = Integer.parseInt(camelotKey2.substring(0, key2Length - 1));
        String tone2 = camelotKey2.substring(key2Length - 1, 2);

        if (getCamelotDiff(key1, key2) > 1) {
            return 0;
        }

        if (key1 == key2) {
            return 1;
        }
        else {
            if (tone1.equals(tone2)) {
                return 1;
            }
            else {
                return 0;
            }
        }

    }

    private float getCamelotDiff(int c1, int c2) {
        int diff = Math.abs(c1 - c2);
        return Math.min(diff, 12 - diff);
    }

    private float computeTempoScore(float t1, float t2) {
        float difference = Math.abs(t1 - t2);

        return (float) Math.exp(-difference / OPTIMAL_TEMPO_DIFF) * 3f;
    }

    private record ComparableSong(
            float matchScore,
            Song song
    ) {
    }
}
