package ch.calu.traktify_backend.services;

import ch.calu.traktify_backend.models.PlaylistGroup;
import ch.calu.traktify_backend.models.dto.DTOMapper;
import ch.calu.traktify_backend.models.dto.GroupDTO;
import ch.calu.traktify_backend.repositories.GroupRepository;
import ch.calu.traktify_backend.repositories.PlaylistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
public class GroupService {

    @Autowired
    GroupRepository groupRepository;

    @Autowired
    PlaylistRepository playlistRepository;

    public GroupDTO[] getAllGroups() {
        List<PlaylistGroup> playlistGroups = groupRepository.findAll();
        GroupDTO[] groupDTOs = new GroupDTO[playlistGroups.size()];

        for (int i = 0; i < playlistGroups.size(); i++) {
            PlaylistGroup playlistGroup = playlistGroups.get(i);
            GroupDTO groupDTO = DTOMapper.INSTANCE.toGroupDTO(playlistGroup);
            groupDTOs[i] = groupDTO;
        }

        return groupDTOs;
    }

    public GroupDTO createGroup(GroupDTO groupDTO) {
        PlaylistGroup playlistGroup = new PlaylistGroup();
        playlistGroup.setName(groupDTO.name());
        playlistGroup.setPlaylists(new HashSet<>());

        playlistGroup = groupRepository.save(playlistGroup);
        return DTOMapper.INSTANCE.toGroupDTO(playlistGroup);
    }

    public GroupDTO editGroupName(String id, GroupDTO editedGroupDTO) {
        Long longID = Long.parseLong(id);
        groupRepository.findById(longID).ifPresent(group -> {
            group.setName(editedGroupDTO.name());
            groupRepository.save(group);
        });
        return editedGroupDTO;
    }

    public void deleteGroup(String id) {
        Long longID = Long.parseLong(id);
        groupRepository.findById(longID).ifPresent(group -> groupRepository.delete(group));
    }

    public void addPlaylistToGroup(String groupID, String playlistID) {
        Long groupIDLong = Long.parseLong(groupID);
        playlistRepository.findBySpotifyID(playlistID).ifPresent(playlist -> groupRepository.findById(groupIDLong).ifPresent(group -> {
            group.getPlaylists().add(playlist);
            groupRepository.save(group);
        }));
    }

    public void deletePlaylistFromGroup(String groupID, String playlistID) {
        Long groupIDLong = Long.parseLong(groupID);
        playlistRepository.findBySpotifyID(playlistID).ifPresent(playlist -> groupRepository.findById(groupIDLong).ifPresent(group -> {
            group.getPlaylists().removeIf(p -> p.getSpotifyID().equals(playlist.getSpotifyID()));
            groupRepository.save(group);
        }));
    }
}
