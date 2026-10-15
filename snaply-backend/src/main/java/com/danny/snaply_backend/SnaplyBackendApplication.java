package com.danny.snaply_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

@SpringBootApplication
@EnableAsync
@EnableScheduling
@EnableJpaRepositories(basePackages = "com.danny.snaply_backend.repository")
@EnableRedisRepositories(basePackages = {})
public class SnaplyBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SnaplyBackendApplication.class, args);
	}

}
