package ch.calu.traktify_backend.repositories;

import ch.calu.traktify_backend.models.db.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {
    Optional<Song> findBySpotifyID(String spotifyID);
}
