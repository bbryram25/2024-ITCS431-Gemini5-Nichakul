// package com.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.web.SecurityFilterChain;

// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {

//     @SuppressWarnings({ "removal" })
//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         http.cors().and().csrf().disable()
//             .authorizeRequests()
//             .requestMatchers("/api/login", "/api/register").permitAll() // Allow login and register
//             .anyRequest().authenticated()
//             .and()
//             .formLogin().permitAll()
//             .and()
//             .logout().permitAll();

//         return http.build();
//     }
// }
