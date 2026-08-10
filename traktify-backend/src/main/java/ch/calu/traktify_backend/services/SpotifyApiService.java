package ch.calu.traktify_backend.services;

import ch.calu.traktify_backend.models.dto.AuthSessionDTO;
import jakarta.annotation.PostConstruct;
import org.apache.hc.core5.http.ParseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRefreshRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;

import java.io.IOException;
import java.net.URI;

@Service
public class SpotifyApiService {

    @Value("${spotifyapi.client-secret}")
    private String clientSecret;
    @Value("${spotifyapi.client-id}")
    private String clientID;

    private static final String redirectURI = "http://localhost:8082/backend/get-user-code";
    protected SpotifyApi api = null;

    private final SettingsService settingsService;

    public SpotifyApiService(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @PostConstruct
    public void init() {
        this.api = new SpotifyApi.Builder()
                .setClientId(clientID)
                .setClientSecret(clientSecret)
                .setRedirectUri(SpotifyHttpManager.makeUri(redirectURI))
                .build();
    }

    public SpotifyApi getApi() {
        return api;
    }

    public AuthSessionDTO checkSession() {
        String spotifyToken = settingsService.getSpotifyToken();

        if (spotifyToken == null || spotifyToken.isEmpty()) {
            return new AuthSessionDTO(false);
        }

        api.setRefreshToken(spotifyToken);
        return new AuthSessionDTO(refreshToken());
    }

    public String buildAuthUrl() {
        AuthorizationCodeUriRequest autRequest = api.authorizationCodeUri()
                .scope("user-read-private,playlist-read-private,playlist-read-collaborative,user-library-read")
                .show_dialog(true)
                .build();
        final URI uri = autRequest.execute();

        return uri.toString();
    }

    public void setUserCode(String userCode) {
        AuthorizationCodeRequest authRequest = api.authorizationCode(userCode).build();
        try {
            final AuthorizationCodeCredentials authCredentials = authRequest.execute();

            api.setAccessToken(authCredentials.getAccessToken());
            api.setRefreshToken(authCredentials.getRefreshToken());

            settingsService.setSpotifyToken(authCredentials.getRefreshToken());

            System.out.println("Token expires in: " + authCredentials.getExpiresIn());
        }
        catch (IOException | ParseException | SpotifyWebApiException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean refreshToken() {
        final AuthorizationCodeRefreshRequest refreshRequest = api.authorizationCodeRefresh()
                .grant_type("refresh_token")
                .refresh_token(api.getRefreshToken())
                .build();
        try {
            AuthorizationCodeCredentials authCredentials = refreshRequest.execute();

            api.setAccessToken(authCredentials.getAccessToken());

            String refreshToken = authCredentials.getRefreshToken();
            if (refreshToken != null && !refreshToken.isEmpty()) {
                api.setRefreshToken(refreshToken);
                settingsService.setSpotifyToken(refreshToken);
                return true;
            }

            return false;
        }
        catch (ParseException | SpotifyWebApiException | IOException e) {
            System.err.println("Something went wrong when refreshing spotify token : " + e.getMessage());
            return false;
        }
    }
}
