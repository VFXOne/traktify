package ch.calu.traktify_backend.repositories;

import ch.calu.traktify_backend.models.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    Optional<Playlist> findBySpotifyID(String playlistID);
}
