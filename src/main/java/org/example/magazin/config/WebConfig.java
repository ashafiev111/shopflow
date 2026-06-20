package org.example.magazin.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PATCH", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }

            @Override
            public void addViewControllers(ViewControllerRegistry registry) {
                registry.addViewController("/").setViewName("forward:/index.html");
                registry.addViewController("/cart").setViewName("forward:/index.html");
                registry.addViewController("/orders").setViewName("forward:/index.html");
                registry.addViewController("/admin").setViewName("forward:/index.html");
                registry.addViewController("/admin/**").setViewName("forward:/index.html");
                registry.addViewController("/product/**").setViewName("forward:/index.html");
                registry.addViewController("/reviews/**").setViewName("forward:/index.html");
                registry.addViewController("/profile").setViewName("forward:/index.html");
                registry.addViewController("/favorites").setViewName("forward:/index.html");
                registry.addViewController("/login").setViewName("forward:/index.html");
                registry.addViewController("/register").setViewName("forward:/index.html");
            }

            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                registry.addResourceHandler("/uploads/**")
                        .addResourceLocations("file:" + uploadDir + "/");
            }
        };
    }
}
