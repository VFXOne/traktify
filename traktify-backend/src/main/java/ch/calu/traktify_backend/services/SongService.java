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

    public Song getSongFromPlaylist(Long id) {
        return songRepository.findById(id).orElse(null);
    }

    public void fillPlaylistWithSongsFromSpotify(Playlist playlistToFill) {
        List<Song> songList = new ArrayList<>();

        List<PlaylistTrack> allTracks = PagingRequestHelper.getAllElements((offset) -> SpotifyService.getApi().getPlaylistsItems(playlistToFill.getSpotifyID()).offset(offset).build());
        for (PlaylistTrack playlistTrack : allTracks) {
            IPlaylistItem item = playlistTrack.getTrack();

            if (item instanceof Track) {
                Song song = new Song();
                //song.setID(songRepository.getNextValMySequence());
                song.setSpotifyID(item.getId());
                song.setName(item.getName());
                song.setArtists(Arrays.stream(((Track) item).getArtists()).map(ArtistSimplified::getName).collect(Collectors.joining(", "))); //TODO map artists
                song.setPlaylists(List.of(playlistToFill));
                song.setDuration_ms(item.getDurationMs());

                songList.add(song);
            }

        }

        playlistToFill.setSongList(songList.isEmpty() ? null : songList);

        //songRepository.saveAll(songList);
    }
}
