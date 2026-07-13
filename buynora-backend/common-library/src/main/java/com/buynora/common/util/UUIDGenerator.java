package com.buynora.common.util;

import java.util.UUID;

public final class UUIDGenerator {
    private UUIDGenerator() {
        // Prevent instantiation
    }

    public static String generateString() {
        return UUID.randomUUID().toString();
    }

    public static UUID generate() {
        return UUID.randomUUID();
    }
}
