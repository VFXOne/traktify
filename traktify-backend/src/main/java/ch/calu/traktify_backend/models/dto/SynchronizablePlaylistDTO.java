package ch.calu.traktify_backend.models.dto;

public record SynchronizablePlaylistDTO(
        String name,
        String id,
        int size,
        boolean isSynchronized
) {
}
