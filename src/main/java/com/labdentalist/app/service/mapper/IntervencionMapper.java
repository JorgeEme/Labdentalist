package com.labdentalist.app.service.mapper;

import com.labdentalist.app.domain.Intervencion;
import com.labdentalist.app.service.dto.IntervencionDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Intervencion} and its DTO {@link IntervencionDTO}.
 */
@Mapper(componentModel = "spring", uses = { CitaMapper.class, FacturaMapper.class, ClienteMapper.class })
public interface IntervencionMapper extends EntityMapper<IntervencionDTO, Intervencion> {
    @Mapping(target = "cita", source = "cita", qualifiedByName = "id")
    @Mapping(target = "factura", source = "factura", qualifiedByName = "id")
    @Mapping(target = "cliente", source = "cliente", qualifiedByName = "id")
    IntervencionDTO toDto(Intervencion s);
}
