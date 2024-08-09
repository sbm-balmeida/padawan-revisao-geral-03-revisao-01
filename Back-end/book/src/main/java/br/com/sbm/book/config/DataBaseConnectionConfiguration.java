package br.com.sbm.book.config;

import javax.sql.DataSource;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataBaseConnectionConfiguration {

	@Bean
    @ConfigurationProperties(prefix="spring.datasource")
    public DataSource dataSource() {
		System.out.println("Conexão realizada!");
        return DataSourceBuilder.create().build();
    }
}
