package internFinder.internFinder.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import internFinder.internFinder.domain.AuthenticateUser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Date;


public class JwtUsernameAndPasswordAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
  private AuthenticationManager authenticationManager;

  public JwtUsernameAndPasswordAuthenticationFilter(AuthenticationManager authenticationManager) {
    this.authenticationManager = authenticationManager;
  }


  //CLIENT IS SENDING CREDENTIALS (EMAIL AND PASSWORD) TO SERVER
  //SERVER IS VALIDATING CREDENTIALS

  @Override
  public Authentication attemptAuthentication(HttpServletRequest request,
                                              HttpServletResponse response) throws AuthenticationException {
    try {

      AuthenticateUser authenticateUser = new ObjectMapper()
        .readValue(request.getInputStream(), AuthenticateUser.class);
      Authentication authentication = new UsernamePasswordAuthenticationToken(
        authenticateUser.getEmail(),
        authenticateUser.getPassword()
      );
      String email =authenticateUser.getEmail();
      String password=authenticateUser.getPassword();
      //System.out.println("User Credentials (username: " + email + " and password: )"+password+ " are validated");
      return authenticationManager.authenticate(authentication);
    } catch (IOException e) {
      System.out.println("Could not validate user");
      throw new RuntimeException(e);
    }
  }

  //SERVER IS GENERATING TOKEN

  @Override
  protected void successfulAuthentication(HttpServletRequest request,
                                          HttpServletResponse response,
                                          FilterChain chain,
                                          Authentication authResult) throws IOException, ServletException {

    String key = "1d657f04-7ce9-4ab5-8600-40f3728511951d657f04-7ce9-4ab5-8600-40f3728511951d657f04-7ce9-4ab5-8600-40f372851195";
    String token =Jwts.builder()
      .setSubject(authResult.getName())
      .claim("authorities", authResult.getAuthorities())
      .setIssuedAt(new Date())
      .setExpiration(java.sql.Date.valueOf(LocalDate.now().plusDays(10)))
      .signWith(Keys.hmacShaKeyFor(key.getBytes()))
      .compact();

    // THE TOKEN IS GENERATED NOW SEND IT TO OUR CLIENT
    //ADD TOKEN TO THE RESPONSE HEADER
    response.addHeader("Authorization","Bearer " + token);
    System.out.println("Generated token is: "+token);
  }
}
