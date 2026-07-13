package com.buynora.common.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import com.buynora.common.constants.GlobalConstants;

public final class DateUtils {
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern(GlobalConstants.DATE_TIME_FORMAT);

    private DateUtils() {
        // Prevent instantiation
    }

    public static String format(LocalDateTime localDateTime) {
        return localDateTime == null ? null : localDateTime.format(DATE_TIME_FORMATTER);
    }

    public static LocalDateTime parse(String dateTimeStr) {
        return dateTimeStr == null ? null : LocalDateTime.parse(dateTimeStr, DATE_TIME_FORMATTER);
    }
}
