package ch.calu.traktify_backend.dto;

import ch.calu.traktify_backend.models.AudioInfo;
import ch.calu.traktify_backend.models.Song;
import ch.calu.traktify_backend.models.dto.AudioInfoDTO;
import ch.calu.traktify_backend.models.dto.DTOMapper;
import ch.calu.traktify_backend.models.dto.SongDTO;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;


public class DTOMappingTest {
    @Test
    public void songToSongDTOTest() {
        Song song = new Song();
        song.setID(23L);
        song.setSpotifyID("123");
        song.setDuration_ms(3000);
        song.setArtists("AC/DC");
        song.setName("Party Rock Anthem");

        AudioInfo audioInfo = new AudioInfo();
        audioInfo.setAcousticness(0.34f);
        audioInfo.setCamelotKey("9B");
        audioInfo.setDanceability(0.61f);
        audioInfo.setEnergy(0.99f);
        audioInfo.setId(432L);
        audioInfo.setTempo(113.1f);
        audioInfo.setValence(0.4f);

        song.setAudioInfo(audioInfo);

        SongDTO songMapped = DTOMapper.INSTANCE.toSongDTO(song);

        assertEquals(song.getSpotifyID(), songMapped.id());
        assertEquals(song.getName(), songMapped.name());
        assertEquals(1, songMapped.artists().size());
        assertEquals(song.getArtists(), songMapped.artists().get(0).name());
        assertEquals(song.getDuration_ms(), songMapped.duration_ms());

        AudioInfoDTO audioInfoMapped = songMapped.audioInfo();
        assertNotNull(audioInfoMapped);
        assertEquals(audioInfo.getCamelotKey(), audioInfoMapped.camelotKey());
        assertEquals(34, audioInfoMapped.acousticness());
        assertEquals(61, audioInfoMapped.danceability());
        assertEquals(99, audioInfoMapped.energy());
        assertEquals(40, audioInfoMapped.valence());
        assertEquals(113, audioInfoMapped.tempo());
    }
}
