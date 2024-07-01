package ch.calu.traktify_backend.services;

import org.apache.hc.core5.http.ParseException;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;

import java.io.IOException;

public class SpotifyService {

    private static SpotifyApi api = null;
    private static AuthorizationCodeRequest authRequest;
    private static String userID;

    public static SpotifyApi getApi() {
        if (api == null) {
            throw new RuntimeException("Spotify API not initialized");
        }
        return api;
    }

    public static void initApi(String clientID, String clientSecret, String redirectURI) {
        if (api == null) {
            api = new SpotifyApi.Builder()
                    .setClientId(clientID)
                    .setClientSecret(clientSecret)
                    .setRedirectUri(SpotifyHttpManager.makeUri(redirectURI))
                    .build();
        }
    }

    public static void setUserCode(String code) throws IOException {
        if (api == null) {
            throw new RuntimeException("Spotify API not initialized");
        }

        if (authRequest == null) {
            authRequest = api.authorizationCode(code).build();
            try {
                final AuthorizationCodeCredentials authCredentials = authRequest.execute();

                api.setAccessToken(authCredentials.getAccessToken());
                api.setRefreshToken(authCredentials.getRefreshToken());

                System.out.println("Expires in: " + authCredentials.getExpiresIn());
            }
            catch (IOException | ParseException | SpotifyWebApiException e) {
                throw new IOException(e);
            }
        }
    }

    public static void setUserID(String username) {
        userID = username;
    }

    public static String getUserID() {
        return userID;
    }
}
