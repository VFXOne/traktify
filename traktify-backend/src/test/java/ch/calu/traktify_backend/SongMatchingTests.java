package ch.calu.traktify_backend;

import ch.calu.traktify_backend.models.AudioInfo;
import ch.calu.traktify_backend.models.Song;
import ch.calu.traktify_backend.services.MatchService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class SongMatchingTests {

    @Autowired
    MatchService matchService;

    @Test
    public void simpleSongMatchingTest() {
        Song songToMatch = new Song();
        songToMatch.setName("Song To Match");
        songToMatch.setArtists("Calu");
        songToMatch.setID(1L);
        songToMatch.setDuration_ms(450000);

        AudioInfo songToMatchAudioInfo = new AudioInfo();
        songToMatchAudioInfo.setCamelotKey("12A");
        songToMatchAudioInfo.setTempo(128f);
        songToMatch.setAudioInfo(songToMatchAudioInfo);

        Song otherSong1 = new Song();
        otherSong1.setName("Other Song 1");
        otherSong1.setArtists("Calu");
        otherSong1.setID(2L);
        otherSong1.setDuration_ms(510000);
        AudioInfo otherSong1AudioInfo = new AudioInfo();
        otherSong1AudioInfo.setCamelotKey("1A");
        otherSong1AudioInfo.setTempo(120f);
        otherSong1.setAudioInfo(otherSong1AudioInfo);

        Song otherSong2 = new Song();
        otherSong2.setName("Other Song 2");
        otherSong2.setArtists("Calu");
        otherSong2.setID(3L);
        otherSong2.setDuration_ms(510000);
        AudioInfo otherSong2AudioInfo = new AudioInfo();
        otherSong2AudioInfo.setCamelotKey("5B");
        otherSong2AudioInfo.setTempo(120f);
        otherSong2.setAudioInfo(otherSong2AudioInfo);

        List<Song> songList = List.of(otherSong2, otherSong1);

        List<Song> result = matchService.matchSongs(songToMatch, songList);

        assert result.get(0).equals(otherSong1);
        assert result.get(1).equals(otherSong2);
    }
}
