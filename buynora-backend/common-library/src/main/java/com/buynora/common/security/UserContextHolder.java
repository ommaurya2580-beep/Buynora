package com.buynora.common.security;

public final class UserContextHolder {
    private static final ThreadLocal<UserContext> userContextThreadLocal = new ThreadLocal<>();

    private UserContextHolder() {
        // Prevent instantiation
    }

    public static void setContext(UserContext context) {
        userContextThreadLocal.set(context);
    }

    public static UserContext getContext() {
        return userContextThreadLocal.get();
    }

    public static void clearContext() {
        userContextThreadLocal.remove();
    }
}
