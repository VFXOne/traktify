package ch.calu.traktify_backend.services;

import ch.calu.traktify_backend.models.AudioInfo;
import ch.calu.traktify_backend.models.Playlist;
import ch.calu.traktify_backend.models.Song;
import ch.calu.traktify_backend.services.utils.PagingRequestHelper;
import ch.calu.traktify_backend.services.utils.RetryRequestHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.enums.Modality;
import se.michaelthelin.spotify.exceptions.detailed.UnauthorizedException;
import se.michaelthelin.spotify.model_objects.IPlaylistItem;
import se.michaelthelin.spotify.model_objects.specification.*;
import se.michaelthelin.spotify.requests.data.tracks.GetAudioFeaturesForTrackRequest;
import se.michaelthelin.spotify.requests.data.users_profile.GetCurrentUsersProfileRequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
public class SpotifyMusicService {

    private static String userID;

    @Autowired
    SpotifyApiService spotifyApiService;

    public List<Playlist> getSpotifyPlaylists() {
        List<Playlist> playlistList = new ArrayList<>();

        List<PlaylistSimplified> list = PagingRequestHelper.getAllElements((offset) -> spotifyApiService.getApi().getListOfCurrentUsersPlaylists().offset(offset).build());

        for (final PlaylistSimplified spotifyPlaylist : list) {
            if (userID != null && spotifyPlaylist.getOwner().getId().equals(userID)) {
                Playlist playlist = new Playlist();
                playlist.setSpotifyID(spotifyPlaylist.getId());
                playlist.setName(spotifyPlaylist.getName());

                playlistList.add(playlist);
            }
        }

        return playlistList;
    }

    public List<Song> getSongsFromSpotifyPlaylist(String spotifyPlaylistID) {
        List<Song> songList = new ArrayList<>();

        List<PlaylistTrack> allTracks = PagingRequestHelper.getAllElements((offset) -> spotifyApiService.getApi().getPlaylistsItems(spotifyPlaylistID).offset(offset).build());
        for (PlaylistTrack playlistTrack : allTracks) {
            IPlaylistItem item = playlistTrack.getTrack();

            if (item instanceof Track track) {
                Song song = new Song();
                song.setSpotifyID(track.getId());
                song.setName(track.getName());
                song.setArtists(Arrays.stream(track.getArtists()).map(ArtistSimplified::getName).collect(Collectors.joining(", "))); //TODO map artists
                song.setDuration_ms(track.getDurationMs());
                songList.add(song);
            }

        }

        return songList;
    }

    public AudioInfo getAudioInfoForSong(Song song) {
        AtomicReference<AudioInfo> audioInfo = new AtomicReference<>();

        callWithRefreshToken(() -> {
            GetAudioFeaturesForTrackRequest spotifyAudioFeaturesRequest = spotifyApiService.getApi().getAudioFeaturesForTrack(song.getSpotifyID()).build();
            AudioFeatures spotifyAudioFeatures = spotifyAudioFeaturesRequest.execute();

            audioInfo.set(new AudioInfo());
            audioInfo.get().setAcousticness(spotifyAudioFeatures.getAcousticness());
            audioInfo.get().setDanceability(spotifyAudioFeatures.getDanceability());
            audioInfo.get().setEnergy(spotifyAudioFeatures.getEnergy());
            audioInfo.get().setTempo(spotifyAudioFeatures.getTempo());
            audioInfo.get().setValence(spotifyAudioFeatures.getValence());

            int spotifyKey = spotifyAudioFeatures.getKey();
            boolean spotifyMode = spotifyAudioFeatures.getMode() == Modality.MAJOR;
            audioInfo.get().setCamelotKey(KeyService.pitchKeyToCamelot(spotifyKey, spotifyMode));
        });

        return audioInfo.get();
    }

    public String getUserID() {
        if (userID == null) {
            callWithRefreshToken(() -> {
                final GetCurrentUsersProfileRequest usersProfileRequest = spotifyApiService.getApi().getCurrentUsersProfile().build();
                final User userProfile = usersProfileRequest.execute();
                userID = userProfile.getId();
            });
        }

        return userID;
    }

    private void callWithRefreshToken(RetryRequestHelper.RetryProvider retryProvider) {
        RetryRequestHelper.callWithRetry(
                retryProvider,
                (exception) -> {
                    if (exception.getClass().equals(UnauthorizedException.class)) {
                        spotifyApiService.refreshToken();
                    }
                }
        );
    }
}
