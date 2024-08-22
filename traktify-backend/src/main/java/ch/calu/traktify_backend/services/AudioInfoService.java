package ch.calu.traktify_backend.services;

import ch.calu.traktify_backend.models.AudioInfo;
import ch.calu.traktify_backend.models.Song;
import ch.calu.traktify_backend.repositories.AudioInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AudioInfoService {

    @Autowired
    AudioInfoRepository audioInfoRepository;

    @Autowired
    SpotifyMusicService spotifyMusicService;

    public void updateAudioInfo(Song song) {
        AudioInfo audioInfo = spotifyMusicService.getAudioInfoForSong(song);
        song.setAudioInfo(audioInfo);
        audioInfoRepository.save(audioInfo);
    }
}
