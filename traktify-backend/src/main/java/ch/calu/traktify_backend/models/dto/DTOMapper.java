package ch.calu.traktify_backend.models.dto;

import ch.calu.traktify_backend.models.Playlist;
import ch.calu.traktify_backend.models.Song;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(
        unmappedTargetPolicy = ReportingPolicy.ERROR,
        unmappedSourcePolicy = ReportingPolicy.IGNORE
)
public interface DTOMapper {

    DTOMapper INSTANCE = Mappers.getMapper(DTOMapper.class);

    @Mapping(source = "spotifyID", target = "id")
    PlaylistDTO toPlaylistDTO(Playlist playlist);

    SongDTO toSongDTO(Song song);

    List<SongDTO> toSongDTOList(List<Song> songs);
}
