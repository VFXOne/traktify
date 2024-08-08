package ch.calu.traktify_backend.controllers;

import ch.calu.traktify_backend.services.SpotifyApiService;
import ch.calu.traktify_backend.services.SpotifyMusicService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@CrossOrigin(origins = "http://localhost:4202")
@RequestMapping("/backend")
public class AuthController {

    public static final String homeURI = "http://localhost:4202/home";

    @Autowired
    SpotifyApiService spotifyApiService;

    @Autowired
    SpotifyMusicService spotifyMusicService;

    @GetMapping("isLoggedIn")
    public boolean isLoggedIn() {
        return spotifyApiService.isLoggedIn();
    }

    @GetMapping(value = "login", produces = "text/plain")
    public String spotifyLogin() {
        if (!isLoggedIn()) {
            return spotifyApiService.doLogin();
        }
        else {
            return homeURI;
        }
    }

    @GetMapping(value = "get-user-code")
    public String getSpotifyUserCode(@RequestParam("code") String code, HttpServletResponse response) throws IOException {
        spotifyApiService.setUserCode(code);

        response.sendRedirect(homeURI);
        return spotifyApiService.getApi().getAccessToken();
    }

    @GetMapping(value = "get-username", produces = "text/plain")
    public String getSpotifyUsername() {
        return spotifyMusicService.getUserID();
    }
}
