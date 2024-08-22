package ch.calu.traktify_backend.repositories;

import ch.calu.traktify_backend.models.Settings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SettingsRepository extends JpaRepository<Settings, Long> {
    default Settings getSettings() {
        Settings s = findById(Settings.settingsID).orElse(new Settings());
        s.setId(Settings.settingsID);

        return s;
    }
}
