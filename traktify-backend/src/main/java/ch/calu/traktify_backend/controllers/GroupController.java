package ch.calu.traktify_backend.controllers;

import ch.calu.traktify_backend.models.dto.GroupDTO;
import ch.calu.traktify_backend.services.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4202")
@RequestMapping("backend")
public class GroupController {

    @Autowired
    GroupService groupService;

    @GetMapping("groups")
    public GroupDTO[] getGroups() {
        return groupService.getAllGroups();
    }

    @PostMapping("groups")
    public GroupDTO createGroup(@RequestBody GroupDTO groupDTO) {
        return groupService.createGroup(groupDTO);
    }

    @PutMapping("groups/{id}")
    public GroupDTO updateGroupName(@PathVariable("id") String groupID, @RequestBody GroupDTO groupDTO) {
        return groupService.editGroupName(groupID, groupDTO);
    }

    @DeleteMapping("groups/{id}")
    public boolean deleteGroup(@PathVariable("id") String groupID) {
        groupService.deleteGroup(groupID);
        return true;
    }

    @PutMapping("groups/add_playlist/{id}")
    public boolean addPlaylistToGroup(@PathVariable("id") String groupID, @RequestBody String playlistID) {
        groupService.addPlaylistToGroup(groupID, playlistID);
        return true;
    }

    @PutMapping("groups/remove_playlist/{id}")
    public boolean removePlaylistFromGroup(@PathVariable("id") String groupID, @RequestBody String playlistID) {
        groupService.deletePlaylistFromGroup(groupID, playlistID);
        return true;
    }
}
