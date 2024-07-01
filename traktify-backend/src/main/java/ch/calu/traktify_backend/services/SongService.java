package ch.calu.traktify_backend.services;

import ch.calu.traktify_backend.models.Song;
import ch.calu.traktify_backend.repositories.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SongService {
    @Autowired
    SongRepository songRepository;

    public Song getSongFromPlaylist(Long id) {
        return songRepository.findById(id).orElse(null);
    }
}
