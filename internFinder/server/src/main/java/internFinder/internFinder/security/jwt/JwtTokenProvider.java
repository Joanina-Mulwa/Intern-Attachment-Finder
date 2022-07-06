package internFinder.internFinder.security.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Date;

@Component
public class JwtTokenProvider {

  public String generateToken(String subject, String authorities ){

      String key = "1d657f04-7ce9-4ab5-8600-40f3728511951d657f04-7ce9-4ab5-8600-40f3728511951d657f04-7ce9-4ab5-8600-40f372851195";
      String token = Jwts.builder()
        .setSubject(subject)
        .claim("authorities",authorities)
        .setIssuedAt(new Date())
        .setExpiration(java.sql.Date.valueOf(LocalDate.now().plusDays(10)))
        .signWith(Keys.hmacShaKeyFor(key.getBytes()))
        .compact();

      // THE TOKEN IS GENERATED NOW SEND IT TO OUR CLIENT
      //ADD TOKEN TO THE RESPONSE HEADER

      System.out.println("Generated token is: "+token);
    return token;
    }
  }


