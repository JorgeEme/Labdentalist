package com.labdentalist.app.repository;

import com.labdentalist.app.domain.Intervencion;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Intervencion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IntervencionRepository extends JpaRepository<Intervencion, Long> {}
