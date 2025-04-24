package com.example.GeminiProject.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.GeminiProject.Model.Telescope;

@Repository
public interface TelescopeRepository extends JpaRepository<Telescope, String> {

    @Query("SELECT t.telescopeID FROM Telescope t ORDER BY t.telescopeID DESC LIMIT 1")
    Optional<String> findMaxTelescopeId();
}
