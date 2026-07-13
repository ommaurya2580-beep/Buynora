package com.buynora.common.util;

import org.junit.jupiter.api.Test;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

public class UUIDGeneratorTest {

    @Test
    public void testGenerateString() {
        String uuidStr = UUIDGenerator.generateString();
        assertNotNull(uuidStr);
        assertFalse(uuidStr.isEmpty());
        // Verify it is a valid UUID format
        assertDoesNotThrow(() -> UUID.fromString(uuidStr));
    }

    @Test
    public void testGenerate() {
        UUID uuid = UUIDGenerator.generate();
        assertNotNull(uuid);
    }
}
