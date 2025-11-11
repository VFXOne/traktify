package ch.calu.traktify_backend.controllers;

import ch.calu.traktify_backend.services.SettingsService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4202")
@RequestMapping("/backend")
public class SetupController {

    private final SettingsService settingsService;

    public SetupController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping("isSetupComplete")
    public boolean isSetupComplete() {
        return settingsService.isSetupComplete();
    }

    @PutMapping("completeSetup")
    public void completeSetup() {
        try {
            settingsService.setSetupAsComplete();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
