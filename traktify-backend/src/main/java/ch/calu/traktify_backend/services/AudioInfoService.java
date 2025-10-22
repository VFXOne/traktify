package ch.calu.traktify_backend.services;

import ch.calu.traktify_backend.models.AudioInfo;
import ch.calu.traktify_backend.models.Song;
import ch.calu.traktify_backend.repositories.AudioInfoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AudioInfoService {

    private final ReccoBeatsApiService reccoBeatsApiService;
    private final AudioInfoRepository audioInfoRepository;

    public AudioInfoService(AudioInfoRepository audioInfoRepository, ReccoBeatsApiService reccoBeatsApiService) {
        this.audioInfoRepository = audioInfoRepository;
        this.reccoBeatsApiService = reccoBeatsApiService;
    }

    public void updateAudioInfo(Song song) {
        if (song.getAudioInfo() == null) {
            Map<Song, AudioInfo> audioInfoMap = reccoBeatsApiService.getAudioInfoForSongs(List.of(song));
            AudioInfo audioInfo = audioInfoMap.get(song);

            song.setAudioInfo(audioInfo);
            audioInfoRepository.save(audioInfo);
        }
    }

    public void updateAudioInfo(List<Song> songs) {
        List<Song> songsToUpdate = songs.stream().filter(s -> s.getAudioInfo() == null).toList();
        Map<Song, AudioInfo> audioInfos = reccoBeatsApiService.getAudioInfoForSongs(songsToUpdate);

        audioInfos.forEach((song, audioInfo) -> {
            song.setAudioInfo(audioInfo);
            audioInfoRepository.save(audioInfo);
        });
    }
}
