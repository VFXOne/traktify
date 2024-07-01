package ch.calu.traktify_backend.controllers;

import ch.calu.traktify_backend.services.SpotifyService;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.hc.core5.http.ParseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.exceptions.detailed.UnauthorizedException;
import se.michaelthelin.spotify.model_objects.specification.User;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;
import se.michaelthelin.spotify.requests.data.users_profile.GetCurrentUsersProfileRequest;

import java.io.IOException;
import java.net.URI;

@RestController
@CrossOrigin(origins = "http://localhost:4202")
@RequestMapping("/backend")
public class AuthController {
    @Value("${spotifyapi.client-secret}")
    private String clientSecret;

    @Value("${spotifyapi.client-id}")
    private String clientID;

    private static final String redirectURI = "http://localhost:8082/backend/get-user-code";
    private static final String homeURI = "http://localhost:4202/home";
    private String userCode = "";
    private boolean loggedIn = false;

    @GetMapping("isLoggedIn")
    public boolean isLoggedIn() {
        return loggedIn;
    }

    @GetMapping(value = "login", produces = "text/plain")
    public String spotifyLogin() throws IOException {
        SpotifyService.initApi(clientID, clientSecret, redirectURI);
        SpotifyApi spotifyApi = SpotifyService.getApi();

        if (!userCode.isEmpty()) {
            SpotifyService.setUserCode(userCode);
            loggedIn = true;
            return homeURI;
        } else {
            AuthorizationCodeUriRequest autRequest = spotifyApi.authorizationCodeUri()
                    .scope("user-read-private,playlist-read-private,playlist-read-collaborative,user-library-read")
                    .show_dialog(true)
                    .build();
            final URI uri = autRequest.execute();
            return uri.toString();
        }
    }

    @GetMapping(value = "get-user-code")
    public String getSpotifyUserCode(@RequestParam("code") String code, HttpServletResponse response) throws IOException {
        userCode = code;
        System.out.println("user code: " + code);

        SpotifyService.setUserCode(code);

        loggedIn = true;

        response.sendRedirect(homeURI);
        return SpotifyService.getApi().getAccessToken();
    }

    @GetMapping(value = "get-username", produces = "text/plain")
    public String getSpotifyUsername() {
        String username;

        final GetCurrentUsersProfileRequest usersProfileRequest = SpotifyService.getApi().getCurrentUsersProfile().build();

        try {
            final User userProfile = usersProfileRequest.execute();

            username = userProfile.getId();
            SpotifyService.setUserID(username);
        }
        catch (UnauthorizedException u) {
            SpotifyService.refreshToken();
            throw new RuntimeException("Unable to refresh Spotify token");
        }
        catch (IOException | ParseException | SpotifyWebApiException e) {
            throw new RuntimeException(e);
        }

        return username;
    }
}
