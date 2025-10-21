package ch.calu.traktify_backend.services;

import ch.calu.traktify_backend.models.AudioInfo;
import ch.calu.traktify_backend.models.Playlist;
import ch.calu.traktify_backend.models.Song;
import ch.calu.traktify_backend.services.utils.PagingRequestHelper;
import ch.calu.traktify_backend.services.utils.RetryRequestHelper;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.enums.Modality;
import se.michaelthelin.spotify.exceptions.detailed.TooManyRequestsException;
import se.michaelthelin.spotify.exceptions.detailed.UnauthorizedException;
import se.michaelthelin.spotify.model_objects.IPlaylistItem;
import se.michaelthelin.spotify.model_objects.specification.*;
import se.michaelthelin.spotify.requests.data.tracks.GetAudioFeaturesForSeveralTracksRequest;
import se.michaelthelin.spotify.requests.data.tracks.GetAudioFeaturesForTrackRequest;
import se.michaelthelin.spotify.requests.data.users_profile.GetCurrentUsersProfileRequest;

import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class SpotifyMusicService {

    private static String userID;
    private final SpotifyApiService spotifyApiService;

    public SpotifyMusicService(SpotifyApiService spotifyApiService) {
        this.spotifyApiService = spotifyApiService;
    }


    public List<Playlist> getSpotifyPlaylists() {
        List<Playlist> playlistList = new ArrayList<>();

        List<PlaylistSimplified> list = PagingRequestHelper.getAllElements((offset) -> spotifyApiService.getApi().getListOfCurrentUsersPlaylists().offset(offset).build());

        for (final PlaylistSimplified spotifyPlaylist : list) {
            if (spotifyPlaylist.getOwner().getId().equals(userID)) {
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
        AtomicReference<AudioInfo> audioInfoRef = new AtomicReference<>();

        callWithRefreshToken(() -> {
            GetAudioFeaturesForTrackRequest spotifyAudioFeaturesRequest = spotifyApiService.getApi().getAudioFeaturesForTrack(song.getSpotifyID()).build();
            AudioFeatures spotifyAudioFeatures = spotifyAudioFeaturesRequest.execute();

            AudioInfo audioInfo = mapToAudioInfo(spotifyAudioFeatures);

            audioInfoRef.set(audioInfo);
        });

        return audioInfoRef.get();
    }

    public Map<Song, AudioInfo> getAudioInfoForSongs(List<Song> songs) {
        AtomicReference<Map<Song, AudioInfo>> audioInfoMap = new AtomicReference<>(new HashMap<>());

        List<String> idsList = songs.stream().map(Song::getSpotifyID).toList();
        for (List<String> songIDs : partitionIDs(idsList)) {
            callWithRefreshToken(() -> {
                String[] requestIDs = songIDs.toArray(String[]::new);
                GetAudioFeaturesForSeveralTracksRequest spotifyAudioFeaturesRequest = spotifyApiService.getApi().getAudioFeaturesForSeveralTracks(requestIDs).build();
                AudioFeatures[] audioFeatures = spotifyAudioFeaturesRequest.execute();

                for (AudioFeatures audioFeature : audioFeatures) {
                    AudioInfo audioInfo = mapToAudioInfo(audioFeature);

                    Optional<Song> relatedSong = songs.stream().filter(s -> s.getSpotifyID().equals(audioFeature.getId())).findFirst();
                    relatedSong.ifPresent(song -> audioInfoMap.get().put(song, audioInfo));
                }
            });
        }


        return audioInfoMap.get();
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

    private AudioInfo mapToAudioInfo(AudioFeatures audioFeature) {
        AudioInfo audioInfo = new AudioInfo();
        audioInfo.setAcousticness(audioFeature.getAcousticness());
        audioInfo.setDanceability(audioFeature.getDanceability());
        audioInfo.setEnergy(audioFeature.getEnergy());
        audioInfo.setTempo(audioFeature.getTempo());
        audioInfo.setValence(audioFeature.getValence());

        int spotifyKey = audioFeature.getKey();
        boolean spotifyMode = audioFeature.getMode() == Modality.MAJOR;
        audioInfo.setCamelotKey(KeyService.pitchKeyToCamelot(spotifyKey, spotifyMode));

        return audioInfo;
    }

    private List<List<String>> partitionIDs(List<String> ids) {
        return IntStream.range(0, (ids.size() + 100 - 1) / 100)
                .mapToObj(i -> ids.subList(i * 100, Math.min((i + 1) * 100, ids.size())))
                .collect(Collectors.toList());
    }

    private void callWithRefreshToken(RetryRequestHelper.RetryProvider retryProvider) {
        RetryRequestHelper.callWithRetry(
                retryProvider,
                (exception) -> {
                    if (exception instanceof UnauthorizedException) {
                        spotifyApiService.refreshToken();
                    }
                    else if (exception instanceof TooManyRequestsException tooMany) {
                        int wait = tooMany.getRetryAfter();
                        try {
                            Thread.sleep(wait * 1000L);
                        }
                        catch (InterruptedException ignored) {
                        }
                    }
                }
        );
    }
}
