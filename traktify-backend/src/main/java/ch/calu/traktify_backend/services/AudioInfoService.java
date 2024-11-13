package ch.calu.traktify_backend.services;

import ch.calu.traktify_backend.models.AudioInfo;
import ch.calu.traktify_backend.models.Song;
import ch.calu.traktify_backend.repositories.AudioInfoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AudioInfoService {

    private final AudioInfoRepository audioInfoRepository;
    private final SpotifyMusicService spotifyMusicService;

    public AudioInfoService(AudioInfoRepository audioInfoRepository, SpotifyMusicService spotifyMusicService) {
        this.audioInfoRepository = audioInfoRepository;
        this.spotifyMusicService = spotifyMusicService;
    }

    public void updateAudioInfo(Song song) {
        if (song.getAudioInfo() == null) {
            AudioInfo audioInfo = spotifyMusicService.getAudioInfoForSong(song);
            song.setAudioInfo(audioInfo);
            audioInfoRepository.save(audioInfo);
        }
    }

    public void updateAudioInfo(List<Song> songs) {
        List<Song> songsToUpdate = songs.stream().filter(s -> s.getAudioInfo() == null).toList();
        Map<Song, AudioInfo> audioInfos = spotifyMusicService.getAudioInfoForSongs(songsToUpdate);

        audioInfos.forEach((song, audioInfo) -> {
            song.setAudioInfo(audioInfo);
            audioInfoRepository.save(audioInfo);
        });
    }
}
