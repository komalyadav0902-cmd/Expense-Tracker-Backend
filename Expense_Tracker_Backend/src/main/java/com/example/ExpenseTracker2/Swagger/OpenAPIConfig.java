package com.example.ExpenseTracker2.Swagger;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI(){

        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("Expense Tracker API")
                        .version("1.0")
                        .description("Backend API for Expense Tracker Application"))

        .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }

//    eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhcnlhQGdtYWlsLmNvbSIsImlhdCI6MTc3MzU4NTIyNSwiZXhwIjoxNzczNjcxNjI1fQ.8lVLhYYZZiVspGSqquA-Oas3Fi-Y5IiQCQ6ZpTIJ4aI
}
