package com.labdentalist.app.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.labdentalist.app.domain.Cita} entity.
 */
public class CitaDTO implements Serializable {

    private Long id;

    private Instant fechaEmison;

    private Instant fechaCita;

    private String descripcion;

    private ClienteDTO cliente;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getFechaEmison() {
        return fechaEmison;
    }

    public void setFechaEmison(Instant fechaEmison) {
        this.fechaEmison = fechaEmison;
    }

    public Instant getFechaCita() {
        return fechaCita;
    }

    public void setFechaCita(Instant fechaCita) {
        this.fechaCita = fechaCita;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public ClienteDTO getCliente() {
        return cliente;
    }

    public void setCliente(ClienteDTO cliente) {
        this.cliente = cliente;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CitaDTO)) {
            return false;
        }

        CitaDTO citaDTO = (CitaDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, citaDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CitaDTO{" +
            "id=" + getId() +
            ", fechaEmison='" + getFechaEmison() + "'" +
            ", fechaCita='" + getFechaCita() + "'" +
            ", descripcion='" + getDescripcion() + "'" +
            ", cliente=" + getCliente() +
            "}";
    }
}
