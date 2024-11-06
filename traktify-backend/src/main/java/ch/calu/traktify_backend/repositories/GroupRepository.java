package ch.calu.traktify_backend.repositories;

import ch.calu.traktify_backend.models.PlaylistGroup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<PlaylistGroup, Long> {
}
