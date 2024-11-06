package ch.calu.traktify_backend.models.dto;

import ch.calu.traktify_backend.models.AudioInfo;
import ch.calu.traktify_backend.models.PlaylistGroup;
import ch.calu.traktify_backend.models.Playlist;
import ch.calu.traktify_backend.models.Song;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Mapper(
        unmappedTargetPolicy = ReportingPolicy.ERROR,
        unmappedSourcePolicy = ReportingPolicy.IGNORE
)
public interface DTOMapper {

    DTOMapper INSTANCE = Mappers.getMapper(DTOMapper.class);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "playlists", source = "playlists", qualifiedByName = "playlistSetToList")
    GroupDTO toGroupDTO(PlaylistGroup playlistGroup);

    @Mapping(target = "id", source = "spotifyID")
    @Mapping(target = "songList", ignore = true)
    PlaylistDTO toPlaylistDTOWithoutSongs(Playlist playlist);

    List<PlaylistDTO> mapToPlaylistDTOList(List<Playlist> playlists);

    @Mapping(target = "id", source = "spotifyID")
    @Mapping(target = "audioInfo", source = "audioInfo", qualifiedByName = "toAudioInfoDTO")
    @Mapping(target = "artists", source = "artists", qualifiedByName = "mapToArtistsDTO")
    @Mapping(target = "index", ignore = true)
    SongDTO toSongDTO(Song song);

    @Named("mapToArtistsDTO")
    default List<ArtistDTO> toArtistDTO(String artists) {
        return Arrays.stream(artists.split(", ")).map(ArtistDTO::new).toList();
    }

    List<SongDTO> toSongDTOList(List<Song> songs);

    @Named("toAudioInfoDTO")
    default AudioInfoDTO toAudioInfoDTO(AudioInfo audioInfo) {
        if (audioInfo == null) {
            return null;
        }
        return new AudioInfoDTO(
                audioInfo.getCamelotKey(),
                Math.round(audioInfo.getTempo()),
                Math.round(audioInfo.getAcousticness() * 100),
                Math.round(audioInfo.getDanceability() * 100),
                Math.round(audioInfo.getEnergy() * 100),
                Math.round(audioInfo.getValence() * 100)
        );
    }

    @AfterMapping
    default void initIndexes(@MappingTarget List<SongDTO> songs) {
        for (int i = 0; i < songs.size(); i++) {
            SongDTO s = songs.get(i);
            songs.set(i, new SongDTO(i + 1, s.id(), s.name(), s.artists(), s.duration_ms(), s.audioInfo()));
        }
    }

    @Named("playlistSetToList")
    default List<PlaylistDTO> mapPlaylistSetToPlaylistDTOList(Set<Playlist> playlists) {
        return this.mapToPlaylistDTOList(playlists.stream().toList());
    }
}
