package ch.calu.traktify_backend.repositories;

import ch.calu.traktify_backend.models.db.AudioInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AudioInfoRepository extends JpaRepository<AudioInfo, Long> {
}
