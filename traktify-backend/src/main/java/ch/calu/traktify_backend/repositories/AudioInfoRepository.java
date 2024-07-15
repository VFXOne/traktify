package ch.calu.traktify_backend.repositories;

import ch.calu.traktify_backend.models.AudioInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AudioInfoRepository extends JpaRepository<AudioInfo, Long> {
}
