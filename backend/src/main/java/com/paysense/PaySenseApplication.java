package com.paysense;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;

@SpringBootApplication
@Configuration
public class PaySenseApplication {

    public static void main(String[] args) {
        SpringApplication.run(PaySenseApplication.class, args);
    }
}
