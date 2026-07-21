package com.buynora.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class GlobalLoggingFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(GlobalLoggingFilter.class);
    private static final String REQUEST_ID_HEADER = "X-Request-Id";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        
        // 1. Handle Request ID
        String incomingRequestId = request.getHeaders().getFirst(REQUEST_ID_HEADER);
        final String requestId;
        ServerWebExchange finalExchange = exchange;
        if (incomingRequestId == null || incomingRequestId.isEmpty()) {
            requestId = UUID.randomUUID().toString();
            request = request.mutate().header(REQUEST_ID_HEADER, requestId).build();
            finalExchange = exchange.mutate().request(request).build();
        } else {
            requestId = incomingRequestId;
        }

        // 2. Log incoming request
        long startTime = System.currentTimeMillis();
        String path = request.getURI().getPath();
        String method = request.getMethod().name();
        
        logger.info("Incoming Request: [id: {}, method: {}, path: {}]", requestId, method, path);

        // 3. Continue chain and log response time
        ServerWebExchange finalExchangeForLambda = finalExchange;
        return chain.filter(finalExchangeForLambda).then(Mono.fromRunnable(() -> {
            ServerHttpResponse response = finalExchangeForLambda.getResponse();
            long executionTime = System.currentTimeMillis() - startTime;
            
            logger.info("Outgoing Response: [id: {}, status: {}, time: {}ms]", 
                    requestId, 
                    response.getStatusCode(), 
                    executionTime);
        }));
    }

    @Override
    public int getOrder() {
        return -1; // Highest precedence
    }
}
