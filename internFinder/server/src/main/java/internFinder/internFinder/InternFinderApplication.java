package internFinder.internFinder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@SpringBootApplication
public class InternFinderApplication {

	public static void main(String[] args) {
		SpringApplication.run(InternFinderApplication.class, args);
	}
	@Bean
	public CorsFilter corsFilter() {
		CorsConfiguration corsConfiguration = new CorsConfiguration();
		corsConfiguration.setMaxAge(5000L);
//		corsConfiguration.setAllowCredentials(true);
//		corsConfiguration.addAllowedHeader("*");
//		corsConfiguration.addAllowedOrigin("*");
//		corsConfiguration.addAllowedMethod("*");
//		corsConfiguration.addExposedHeader("*");
		corsConfiguration.setAllowCredentials(true);
		corsConfiguration.setAllowedOrigins(Arrays.asList("https://internfindermanager.netlify.app", "https://638e988b113ea7419fb5e408--internfindermanager.netlify.app","http://localhost:4200","https://8093-196-250-212-142.in.ngrok.io","http://localhost:4200", "http://127.0.0.1:9614", "https://api.superparser.com/parse","https://api.affinda.com/v2/job_descriptions","https://api.affinda.com/v2","https://api.affinda.com",  "api.superparser.com"));
		corsConfiguration.setAllowedHeaders(Arrays.asList("Origin","https://internfindermanager.netlify.app", "Access-Control-Allow-Origin: *", "Content-Type",
				"Accept", "Authorization", "Origin, Accept", "X-Requested-With","authority","x-api-key",
				"Access-Control-Request-Method", "Access-Control-Request-Headers", "Access-Control-Allow-Origin: * always"));
		corsConfiguration.setExposedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization", "authority","x-api-key",
				"Access-Control-Allow-Origin: *", "Access-Control-Allow-Origin: *", "Access-Control-Allow-Credentials"));
		corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
		urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
		return new CorsFilter(urlBasedCorsConfigurationSource);
	}
}
