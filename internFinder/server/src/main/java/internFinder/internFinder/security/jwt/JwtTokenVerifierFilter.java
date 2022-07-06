package internFinder.internFinder.security.jwt;

import com.google.common.base.Strings;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class JwtTokenVerifierFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {
    //GET TOKEN TO HEADER WHEN CLIENT SUBMITS REQUEST
    //VERIFY THE TOKEN
    String authorizationHeader = request.getHeader("Authorization");
    if(Strings.isNullOrEmpty(authorizationHeader) || !authorizationHeader.startsWith("Bearer ")){
      filterChain.doFilter(request, response);
      System.out.println("Invalid Token");
      return;
    }
    String token = authorizationHeader.replace("Bearer ", "");
    try {
      //Try block tries to validate token
      //Token can be modified or expired
      String key = "1d657f04-7ce9-4ab5-8600-40f3728511951d657f04-7ce9-4ab5-8600-40f3728511951d657f04-7ce9-4ab5-8600-40f372851195";


      Jws<Claims> claimsJws =Jwts.parser()
        .setSigningKey(Keys.hmacShaKeyFor(key.getBytes()))
        .parseClaimsJws(token);

      Claims body = claimsJws.getBody();

      String email = body.getSubject();

      var authorities =(List<Map<String,String>>) body.get("authorities");

      Set<SimpleGrantedAuthority> simpleGrantedAuthorities = authorities.stream()
        .map(m -> new SimpleGrantedAuthority(m.get("authority")))
        .collect(Collectors.toSet());

      //Get authentication
      Authentication authentication = new UsernamePasswordAuthenticationToken(
        email,null,
        simpleGrantedAuthorities
      );

      //Set authentication to be true(user who has sent the token is authenticated)
      SecurityContextHolder.getContext().setAuthentication(authentication);
      System.out.print("Token is trusted and is : " + token);
    }
    catch (JwtException e){
      throw new IllegalStateException(String.format("Token %s cannot be trusted", token));
    }
    //Pass response to next filter in filter chain
    filterChain.doFilter(request, response);

  }
}
