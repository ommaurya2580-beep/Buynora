package com.buynora.common.mapper;

import java.util.List;

public interface GenericMapper<D, E> {
    E toEntity(D dto);
    D toDto(E entity);
    List<E> toEntityList(List<D> dtoList);
    List<D> toDtoList(List<E> entityList);
}
