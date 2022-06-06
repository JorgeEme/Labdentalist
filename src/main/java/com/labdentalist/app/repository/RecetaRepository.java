package com.labdentalist.app.repository;

import com.labdentalist.app.domain.Receta;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Receta entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RecetaRepository extends JpaRepository<Receta, Long> {}
