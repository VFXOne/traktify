package ch.calu.traktify_backend.services;

import ch.calu.traktify_backend.models.Playlist;
import ch.calu.traktify_backend.models.Song;
import ch.calu.traktify_backend.repositories.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.model_objects.IPlaylistItem;
import se.michaelthelin.spotify.model_objects.specification.ArtistSimplified;
import se.michaelthelin.spotify.model_objects.specification.PlaylistTrack;
import se.michaelthelin.spotify.model_objects.specification.Track;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SongService {
    @Autowired
    SongRepository songRepository;

    @Autowired
    AudioInfoService audioInfoService;

    public Song getSongFromPlaylist(String id) {
        return songRepository.findBySpotifyID(id).orElse(null);
    }

    public void fillPlaylistWithSongsFromSpotify(Playlist playlistToFill) {
        List<Song> songList = new ArrayList<>();

        List<PlaylistTrack> allTracks = PagingRequestHelper.getAllElements((offset) -> SpotifyService.getApi().getPlaylistsItems(playlistToFill.getSpotifyID()).offset(offset).build());
        for (PlaylistTrack playlistTrack : allTracks) {
            IPlaylistItem item = playlistTrack.getTrack();

            if (item instanceof Track) {
                Song song = newSongFromSpotifyTrack((Track) item, playlistToFill);
                songList.add(song);
            }

        }

        playlistToFill.setSongList(songList.isEmpty() ? null : songList);
    }

    private Song newSongFromSpotifyTrack(Track track, Playlist inPlaylist) {
        Song song = new Song();
        song.setSpotifyID(track.getId());
        song.setName(track.getName());
        song.setArtists(Arrays.stream(track.getArtists()).map(ArtistSimplified::getName).collect(Collectors.joining(", "))); //TODO map artists
        song.setPlaylists(List.of(inPlaylist));
        song.setDuration_ms(track.getDurationMs());

        return audioInfoService.updateAudioInfo(song);
    }
}
