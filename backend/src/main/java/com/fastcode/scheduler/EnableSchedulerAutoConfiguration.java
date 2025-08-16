package com.fastcode.scheduler;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@ComponentScan("com.fastcode.scheduler")
@EntityScan(basePackages = "com.fastcode.scheduler.domain.model")
@EnableJpaRepositories(basePackages = {"com.fastcode.scheduler.domain.irepository"})
public class EnableSchedulerAutoConfiguration {
}
