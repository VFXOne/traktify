package ch.calu.traktify_backend.services;

import ch.calu.traktify_backend.models.Settings;
import ch.calu.traktify_backend.repositories.SettingsRepository;
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

    private boolean isLoggedIn = false;

    private static final String ALREADY_LOGGED_IN = "LOGGED_IN";
    private static final String redirectURI = "http://localhost:8082/backend/get-user-code";
    protected SpotifyApi api = null;

    private final SettingsRepository settingsRepository;

    public SpotifyApiService(SettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    public SpotifyApi getApi() {
        return api;
    }

    public boolean isLoggedIn() {
        return isLoggedIn;
    }

    public String doLogin() {
        initApi();
        Settings settings = settingsRepository.getSettings();

        if (settings.getSpotifyApiRefreshToken() == null) {
            AuthorizationCodeUriRequest autRequest = api.authorizationCodeUri()
                    .scope("user-read-private,playlist-read-private,playlist-read-collaborative,user-library-read")
                    .show_dialog(true)
                    .build();
            final URI uri = autRequest.execute();

            return uri.toString();
        }
        else {
            String refreshToken = settings.getSpotifyApiRefreshToken();
            initApi();
            api.setRefreshToken(refreshToken);
            refreshToken();

            isLoggedIn = true;

            return ALREADY_LOGGED_IN;
        }
    }

    public void setUserCode(String userCode) {
        AuthorizationCodeRequest authRequest = api.authorizationCode(userCode).build();
        try {
            final AuthorizationCodeCredentials authCredentials = authRequest.execute();

            api.setAccessToken(authCredentials.getAccessToken());
            api.setRefreshToken(authCredentials.getRefreshToken());

            Settings settings = settingsRepository.getSettings();
            settings.setSpotifyApiRefreshToken(authCredentials.getRefreshToken());
            settingsRepository.save(settings);

            System.out.println("Token expires in: " + authCredentials.getExpiresIn());
            isLoggedIn = true;
        }
        catch (IOException | ParseException | SpotifyWebApiException e) {
            throw new RuntimeException(e);
        }
    }

    protected void initApi() {
        if (api == null) {
            this.api = new SpotifyApi.Builder()
                    .setClientId(clientID)
                    .setClientSecret(clientSecret)
                    .setRedirectUri(SpotifyHttpManager.makeUri(redirectURI))
                    .build();
        }
    }

    public void refreshToken() {
        final AuthorizationCodeRefreshRequest refreshRequest = api.authorizationCodeRefresh()
                .grant_type("refresh_token")
                .refresh_token(api.getRefreshToken())
                .build();
        try {
            AuthorizationCodeCredentials authCredentials = refreshRequest.execute();

            api.setAccessToken(authCredentials.getAccessToken());
            api.setRefreshToken(authCredentials.getRefreshToken());
        }
        catch (ParseException | SpotifyWebApiException | IOException e) {
            throw new RuntimeException("Something went wrong when refreshing spotify token", e);
        }
    }
}
