package ch.calu.traktify_backend.controllers;

import ch.calu.traktify_backend.models.dto.AuthSessionDTO;
import ch.calu.traktify_backend.services.SpotifyApiService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@CrossOrigin(origins = "http://localhost:4202")
@RequestMapping("/backend")
public class AuthController {

    public static final String homeURI = "http://localhost:4202/home";

    private final SpotifyApiService spotifyApiService;

    public AuthController(SpotifyApiService spotifyApiService) {
        this.spotifyApiService = spotifyApiService;
    }

    @GetMapping("session")
    public ResponseEntity<AuthSessionDTO> session() {
        return ResponseEntity.ok(spotifyApiService.checkSession());
    }

    @GetMapping("login-url")
    public ResponseEntity<String> loginUrl() {
        return ResponseEntity.ok(spotifyApiService.buildAuthUrl());
    }

    @GetMapping(value = "get-user-code")
    public String getSpotifyUserCode(@RequestParam("code") String code, HttpServletResponse response) throws IOException {
        spotifyApiService.setUserCode(code);

        response.sendRedirect(homeURI);
        return spotifyApiService.getApi().getAccessToken();
    }
}
