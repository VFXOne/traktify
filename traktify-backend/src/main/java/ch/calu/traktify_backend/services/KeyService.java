package ch.calu.traktify_backend.services;

import org.springframework.data.util.Pair;

import java.util.HashMap;
import java.util.Map;

public abstract class KeyService {
    public static String pitchKeyToCamelot(int pitchClass, boolean major) {
        return keysMap.get(Pair.of(pitchClass, major));
    }

    private static final Map<Pair<Integer, Boolean>, String> keysMap = new HashMap<>() {{
        //Major
        put(Pair.of(0, true), "8B");
        put(Pair.of(1, true), "3B");
        put(Pair.of(2, true), "10B");
        put(Pair.of(3, true), "5B");
        put(Pair.of(4, true), "12B");
        put(Pair.of(5, true), "7B");
        put(Pair.of(6, true), "2B");
        put(Pair.of(7, true), "9B");
        put(Pair.of(8, true), "4B");
        put(Pair.of(9, true), "11B");
        put(Pair.of(10, true), "6B");
        put(Pair.of(11, true), "1B");
        //Minor
        put(Pair.of(0, false), "5A");
        put(Pair.of(1, false), "12A");
        put(Pair.of(2, false), "7A");
        put(Pair.of(3, false), "2A");
        put(Pair.of(4, false), "9A");
        put(Pair.of(5, false), "4A");
        put(Pair.of(6, false), "11A");
        put(Pair.of(7, false), "6A");
        put(Pair.of(8, false), "1A");
        put(Pair.of(9, false), "8A");
        put(Pair.of(10, false), "3A");
        put(Pair.of(11, false), "10A");
    }};

}
