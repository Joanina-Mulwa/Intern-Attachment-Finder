package internFinder.internFinder.security;

import internFinder.internFinder.domain.enumarations.UserAuthority;
import internFinder.internFinder.security.jwt.JwtTokenVerifierFilter;
import internFinder.internFinder.security.jwt.JwtUsernameAndPasswordAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;


@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

private final PasswordEncoder passwordEncoder;

//private final UserPrincipalDetailsService userPrincipalDetailsService;

  //DATABASE AUTHENTICATION
//  @Autowired
//  DataSource dataSource;


  @Autowired
  public SecurityConfig(PasswordEncoder passwordEncoder

                        //UserPrincipalDetailsService userPrincipalDetailsService
                       ) {

  this.passwordEncoder = passwordEncoder;

  //this.userPrincipalDetailsService=userPrincipalDetailsService;

  }
//INMEMORY AUTHENTICATION
//  @Override
  @Bean
  protected UserDetailsService userDetailsService() {
    //This is how you retrieve your users from database
    UserDetails admin = User.builder()
      .username("admin")
      .password(passwordEncoder.encode("Admin123"))
      .roles(UserAuthority.SUPPORT.name())
      .build();
    return new InMemoryUserDetailsManager(admin);

  }

  //DATABASE AUTHENTICATION
  //Enable jdbc authentication
//  @Autowired
//  public void configAuthentication(AuthenticationManagerBuilder auth) throws Exception {
//    auth.jdbcAuthentication().dataSource(dataSource);
//  }
//
//  @Override
//  public void configure(WebSecurity web) throws Exception {
//    web.ignoring().antMatchers("/resources/**");
//  }

  //
//  @Bean
//  DaoAuthenticationProvider authenticationProvider() {
//    DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
//    daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
//    daoAuthenticationProvider.setUserDetailsService(this.userPrincipalDetailsService);
//    return daoAuthenticationProvider;
//  }
//


//  @Override
//  protected void configure(AuthenticationManagerBuilder auth){
//    auth.authenticationProvider(authenticationProvider());
//  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http

      //.csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
      .cors().disable()
      .csrf().disable()
      .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      .and()
      .addFilter(new JwtUsernameAndPasswordAuthenticationFilter(authenticationManager()))
      .addFilterAfter(new JwtTokenVerifierFilter(), JwtUsernameAndPasswordAuthenticationFilter.class)
      .authorizeRequests()
      //.antMatchers(HttpMethod.GET, "/api/findRegistered").hasRole(SUPPORT.name())
      //.antMatchers(HttpMethod.POST, "/login").authenticated()
      .antMatchers("/api/**").permitAll()
      .anyRequest()
      .authenticated()
      .and()
      .httpBasic();
  }


//  private PasswordEncoder passwordEncoder() {
//    return new BCryptPasswordEncoder();
//  }
}
