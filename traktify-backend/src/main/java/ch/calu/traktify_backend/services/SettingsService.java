package ch.calu.traktify_backend.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.Reader;
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@Service
public class SettingsService {

    private static final String SPOTIFY_TOKEN = "spotify_token";
    private static final String SETUP_COMPLETE = "setup_complete";

    private static final Path CONFIG_PATH = Paths.get("config.json");
    private static final Map<String, String> DEFAULT_SETTINGS = Map.of(
            SETUP_COMPLETE, "false"
    );
    private Map<String, String> settings = new HashMap<>();

    @PostConstruct
    public void init() throws IOException {
        if (Files.exists(CONFIG_PATH)) {
            try (Reader reader = Files.newBufferedReader(CONFIG_PATH)) {
                settings = new ObjectMapper().readValue(reader, new TypeReference<>() {});
            }
        } else {
            settings.putAll(DEFAULT_SETTINGS);
            save();
        }
    }

    public String getSpotifyToken() {
        return settings.get(SPOTIFY_TOKEN);
    }

    public void setSpotifyToken(String token) throws IOException {
        settings.put(SPOTIFY_TOKEN, token);
        save();
    }

    public boolean isSetupComplete() {
        return Boolean.parseBoolean(settings.getOrDefault(SETUP_COMPLETE, "false"));
    }

    public void setSetupAsComplete() throws IOException {
        settings.put(SETUP_COMPLETE, "true");
        save();
    }

    private void save() throws IOException {
        try (Writer writer = Files.newBufferedWriter(CONFIG_PATH)) {
            new ObjectMapper().writerWithDefaultPrettyPrinter().writeValue(writer, settings);
        }
    }
}
