package com.buynora.common.response;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class ApiResponseTest {

    @Test
    public void testSuccessWithData() {
        ApiResponse<String> response = ApiResponse.success("Hello Data");
        assertTrue(response.isSuccess());
        assertEquals("Success", response.getMessage());
        assertEquals("Hello Data", response.getData());
        assertNotNull(response.getTimestamp());
    }

    @Test
    public void testSuccessWithMessageAndData() {
        ApiResponse<Integer> response = ApiResponse.success("Operation complete", 42);
        assertTrue(response.isSuccess());
        assertEquals("Operation complete", response.getMessage());
        assertEquals(42, response.getData());
        assertNotNull(response.getTimestamp());
    }

    @Test
    public void testError() {
        ApiResponse<Object> response = ApiResponse.error("Something went wrong");
        assertFalse(response.isSuccess());
        assertEquals("Something went wrong", response.getMessage());
        assertNull(response.getData());
        assertNotNull(response.getTimestamp());
    }
}
