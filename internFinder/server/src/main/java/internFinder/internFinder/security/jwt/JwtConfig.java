package internFinder.internFinder.security.jwt;

import com.google.common.net.HttpHeaders;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@ConfigurationProperties(prefix="application.jwt")
@Component
public class JwtConfig {
  private String key;
  private Integer tokenExpirationAfterDays;

  public JwtConfig() {

  }

  public String getKey() {
    return key;
  }

  public void setKey(String key) {
    this.key = key;
  }


  public Integer getTokenExpirationAfterDays() {
    return tokenExpirationAfterDays;
  }

  public void setTokenExpirationAfterDays(Integer tokenExpirationAfterDays) {
    this.tokenExpirationAfterDays = tokenExpirationAfterDays;
  }


  public String getAuthorizationHeader(){
    return HttpHeaders.AUTHORIZATION;
  }
}
