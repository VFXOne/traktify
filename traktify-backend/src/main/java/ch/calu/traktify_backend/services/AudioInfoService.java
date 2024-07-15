package ch.calu.traktify_backend.services;

import ch.calu.traktify_backend.models.AudioInfo;
import ch.calu.traktify_backend.models.Song;
import ch.calu.traktify_backend.repositories.AudioInfoRepository;
import org.apache.hc.core5.http.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.enums.Modality;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.AudioFeatures;
import se.michaelthelin.spotify.requests.data.tracks.GetAudioFeaturesForTrackRequest;

import java.io.IOException;

@Service
public class AudioInfoService {

    @Autowired
    AudioInfoRepository audioInfoRepository;

    public Song updateAudioInfo(Song song) {
        GetAudioFeaturesForTrackRequest spotifyAudioFeaturesRequest = SpotifyService.getApi().getAudioFeaturesForTrack(song.getSpotifyID()).build();

        try {
            AudioFeatures spotifyAudioFeatures = spotifyAudioFeaturesRequest.execute();

            AudioInfo audioInfo = new AudioInfo();
            audioInfo.setAcousticness(spotifyAudioFeatures.getAcousticness());
            audioInfo.setDanceability(spotifyAudioFeatures.getDanceability());
            audioInfo.setEnergy(spotifyAudioFeatures.getEnergy());
            audioInfo.setTempo(spotifyAudioFeatures.getTempo());
            audioInfo.setValence(spotifyAudioFeatures.getValence());

            int spotifyKey = spotifyAudioFeatures.getKey();
            boolean spotifyMode = spotifyAudioFeatures.getMode() == Modality.MAJOR;
            audioInfo.setCamelotKey(KeyService.pitchKeyToCamelot(spotifyKey, spotifyMode));

            song.setAudioInfo(audioInfo);
            audioInfoRepository.save(audioInfo);
        }
        catch (IOException | ParseException | SpotifyWebApiException e) {
            throw new RuntimeException(e);
        }

        return song;
    }
}
