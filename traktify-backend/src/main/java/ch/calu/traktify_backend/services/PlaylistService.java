package ch.calu.traktify_backend.services;

import ch.calu.traktify_backend.models.SpotifyPlaylist;
import ch.calu.traktify_backend.models.db.Playlist;
import ch.calu.traktify_backend.models.db.Song;
import ch.calu.traktify_backend.models.dto.DTOMapper;
import ch.calu.traktify_backend.models.dto.PlaylistDisplayDTO;
import ch.calu.traktify_backend.models.dto.PlaylistWithSongsDTO;
import ch.calu.traktify_backend.models.dto.SynchronizablePlaylistDTO;
import ch.calu.traktify_backend.repositories.GroupRepository;
import ch.calu.traktify_backend.repositories.PlaylistRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final SongService songService;
    private final SpotifyMusicService spotifyMusicService;
    private final GroupRepository groupRepository;

    public PlaylistService(PlaylistRepository playlistRepository, SongService songService, SpotifyMusicService spotifyMusicService, GroupRepository groupRepository) {
        this.playlistRepository = playlistRepository;
        this.songService = songService;
        this.spotifyMusicService = spotifyMusicService;
        this.groupRepository = groupRepository;
    }

    /**
     * Retourne une liste de playlist sans les morceaux de chaque playlist.
     * Il faut utiliser la fonction `getSongsFromPlaylist` pour remplir ces listes avec les morceaux.
     *
     * @return Une liste d'objets PlaylistDTO pour le frontend.
     */
    public PlaylistDisplayDTO[] getAllPlaylistsWithoutSongs() {
        List<Playlist> playlists = playlistRepository.findAll();
        PlaylistDisplayDTO[] playlistDTOs = new PlaylistDisplayDTO[playlists.size()];

        for (int i = 0; i < playlists.size(); i++) {
            Playlist playlist = playlists.get(i);
            PlaylistDisplayDTO playlistDTO = DTOMapper.INSTANCE.toPlaylistDTOWithoutSongs(playlist);
            playlistDTOs[i] = playlistDTO;
        }

        return playlistDTOs;
    }

    /**
     * Retourne la playlist remplie avec les chansons qui sont dedans
     * @param playlistId L'ID de la playlist à remplir
     * @return La playlist avec la liste des chansons
     */
    public PlaylistWithSongsDTO getPlaylistWithSongs(String playlistId) {
        Optional<Playlist> playlist = playlistRepository.findBySpotifyID(playlistId);

        return playlist
                .map(p -> {
                    if (p.getSongList() == null || p.getSongList().isEmpty()) {
                        songService.fillPlaylistWithSongsFromSpotify(p);
                    }
                    return p;
                })
                .map(DTOMapper.INSTANCE::toPlaylistDTOWithSongs)
                .orElse(null);
    }

    public SynchronizablePlaylistDTO[] getSynchronizablePlaylists() {
        List<SpotifyPlaylist> spotifyPlaylists = spotifyMusicService.getSpotifyPlaylists();
        List<Playlist> playlists = playlistRepository.findAll();

        SynchronizablePlaylistDTO[] playlistDTOs = new SynchronizablePlaylistDTO[spotifyPlaylists.size()];
        for (int i = 0; i < spotifyPlaylists.size(); i++) {
            SpotifyPlaylist spotifyPlaylist = spotifyPlaylists.get(i);
            boolean isSynchronized = playlists.stream().anyMatch(p -> p.getSpotifyID().equals(spotifyPlaylist.spotifyID()));

            playlistDTOs[i] = DTOMapper.INSTANCE.mapToSelectablePlaylistDTO(spotifyPlaylist, isSynchronized);
        }

        return playlistDTOs;
    }

    public boolean syncPlaylistWithSpotify(String playlistId) {
        if (playlistRepository.findBySpotifyID(playlistId).isEmpty()) {
            Playlist playlist = spotifyMusicService.getPlaylistInfo(playlistId);

            if (playlist != null) {
                songService.fillPlaylistWithSongsFromSpotify(playlist);
                playlistRepository.save(playlist);
                return true;
            } else {
                return false;
            }
        }
        return true;
    }

    @Transactional
    public boolean unsyncPlaylist(String playlistId) {
        Optional<Playlist> playlist = playlistRepository.findBySpotifyID(playlistId);
        playlist.ifPresent(p -> {
            p.getSongList().forEach(song -> songService.deleteSongFromPlaylist(song.getSpotifyID(), playlistId));

            p.getPlaylistGroups().forEach(group -> group.getPlaylists().remove(p));

            playlistRepository.deleteBySpotifyID(playlistId);
        });

        return playlist.isPresent();
    }

    public List<Song> getSongsFromPlaylist(String playlistID) {
        Playlist playlist = playlistRepository.findBySpotifyID(playlistID).orElseThrow();
        if (playlist.getSongList().isEmpty()) {
            songService.fillPlaylistWithSongsFromSpotify(playlist);
            playlistRepository.save(playlist);
        }
        return playlist.getSongList();
    }

    private List<SpotifyPlaylist> getPlaylistsFromSpotify() {
        return spotifyMusicService.getSpotifyPlaylists();
    }
}
