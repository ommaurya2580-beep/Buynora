package com.buynora.common.util;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

public class DateUtilsTest {

    @Test
    public void testFormatSuccess() {
        LocalDateTime dateTime = LocalDateTime.of(2026, 7, 13, 22, 15, 30);
        String formatted = DateUtils.format(dateTime);
        assertEquals("2026-07-13 22:15:30", formatted);
    }

    @Test
    public void testFormatNull() {
        assertNull(DateUtils.format(null));
    }

    @Test
    public void testParseSuccess() {
        String dateTimeStr = "2026-07-13 22:15:30";
        LocalDateTime parsed = DateUtils.parse(dateTimeStr);
        assertNotNull(parsed);
        assertEquals(2026, parsed.getYear());
        assertEquals(7, parsed.getMonthValue());
        assertEquals(13, parsed.getDayOfMonth());
        assertEquals(22, parsed.getHour());
        assertEquals(15, parsed.getMinute());
        assertEquals(30, parsed.getSecond());
    }

    @Test
    public void testParseNull() {
        assertNull(DateUtils.parse(null));
    }
}
