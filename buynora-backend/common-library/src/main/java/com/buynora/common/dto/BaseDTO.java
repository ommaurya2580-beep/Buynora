package com.buynora.common.dto;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public abstract class BaseDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
