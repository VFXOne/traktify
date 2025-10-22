package ch.calu.traktify_backend.services;

import ch.calu.traktify_backend.models.AudioInfo;
import ch.calu.traktify_backend.models.Song;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <a href="https://reccobeats.com/docs/apis/get-audio-features">API Doc</a>
 */
@Service
public class ReccoBeatsApiService {

    private static final String API_URL = "https://api.reccobeats.com/v1/audio-features";
    private static final int MAX_IDS_PER_REQUEST = 40;

    public ReccoBeatsApiService() {
    }

    public Map<Song, AudioInfo> getAudioInfoForSongs(List<Song> songs) {
        Map<Song, AudioInfo> result = new HashMap<>();

        for (int i = 0; i < songs.size(); i += MAX_IDS_PER_REQUEST) {
            int end = Math.min(i + MAX_IDS_PER_REQUEST, songs.size());
            List<Song> batch = songs.subList(i, end);
            Map<Song, AudioInfo> songInfo = Map.of();

            try {
                songInfo = getAudioInfoFromApi(batch);
            }
            catch (IOException e) {
//                throw new RuntimeException(e);
                //TODO Handle or log error
            }

            result.putAll(songInfo);
        }

        return result;
    }

    private Map<Song, AudioInfo> getAudioInfoFromApi(List<Song> batch) throws IOException {
        Map<Song, AudioInfo> result = new HashMap<>();

        List<String> spotifyIdList = batch.stream().map(Song::getSpotifyID).toList();
        String joinedIds = String.join(",", spotifyIdList);
        String urlString = API_URL + "?ids=" + joinedIds;

        URL url = new URL(urlString);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/json");

        int responseCode = conn.getResponseCode();
        if (responseCode != 200) {
            throw new IOException("Failed : HTTP error code : " + responseCode);
        }

        List<JSONObject> responseContent = getJsonResultArray(conn.getInputStream());
        conn.disconnect();

        for (JSONObject feature : responseContent) {
            String id = feature.getString("id");
            float tempo = feature.getFloat("tempo");
            float valence = feature.getFloat("valence");
            float acousticness = feature.getFloat("acousticness");
            float danceability = feature.getFloat("danceability");
            float energy = feature.getFloat("energy");
            int key = feature.getInt("key");
            int mode = feature.getInt("mode");

            AudioInfo audioInfo = new AudioInfo();
            audioInfo.setTempo(tempo);
            audioInfo.setValence(valence);
            audioInfo.setAcousticness(acousticness);
            audioInfo.setDanceability(danceability);
            audioInfo.setEnergy(energy);
            audioInfo.setCamelotKey(KeyService.pitchKeyToCamelot(key, mode == 1));

            batch.stream()
                    .filter(s -> s.getSpotifyID().equals(id))
                    .findFirst()
                    .ifPresent(s -> result.put(s, audioInfo));
        }


        return result;
    }

    private static List<JSONObject> getJsonResultArray(InputStream inputStream) throws IOException {
        StringBuilder responseString = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                responseString.append(line);
            }
        }
        JSONObject jsonResponse = new JSONObject(responseString.toString());
        JSONArray featuresArray = jsonResponse.getJSONArray("content");

        List<JSONObject> result = new ArrayList<>();
        if (featuresArray != null) {
            for (int i = 0; i < featuresArray.length(); i++) {
                JSONObject feature = featuresArray.getJSONObject(i);
                result.add(feature);
            }
        }

        return result;
    }

}
