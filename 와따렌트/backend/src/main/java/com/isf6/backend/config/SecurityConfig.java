package com.isf6.backend.config;

import com.isf6.backend.config.jwt.CustomAuthenticationEntryPoint;
import com.isf6.backend.config.jwt.JwtRequestFilter;
import com.isf6.backend.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;

// Oauth 로그인 진행 순서
// 1. 인가 코드 발급(회원 인증)
// 2. 엑세스 토큰 발급(접근 권한 부여)
// 3. 액세스 토큰을 이용해 사용자 정보 불러오기
// 4. 불러온 사용자 정보를 토대로 자동 회원가입/로그인 진행
// ※ 소셜 플랫폼의 로그인과 프로젝트 앱의 로그인은 별개임!!

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    UserRepository userRepository;

    public static final String FRONT_URL = "http://i8c110.p.ssafy.io:80";

    private final CorsFilter corsFilter;

    // @Bean -> 해당 메소드의 리턴되는 오브젝트를 IoC로 등록해줌
    @Bean
    public BCryptPasswordEncoder encodePwd() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .sessionManagement()  // session 을 사용하지 않음
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)

                .and()
                .httpBasic().disable()
                .formLogin().disable()
                .addFilter(corsFilter); // @CrossOrigin(인증X), 시큐리티 필터에 등록 인증(O)

        http.authorizeRequests()
                .antMatchers(FRONT_URL+"/main/**")
                .authenticated()
                .antMatchers().authenticated() //ROLE 을 정해주고 허용되는 url만 적어주거나 하면 된대~~
                .anyRequest().permitAll()

                .and()
                .exceptionHandling()
                .authenticationEntryPoint(new CustomAuthenticationEntryPoint());

        http.addFilterBefore(new JwtRequestFilter(), UsernamePasswordAuthenticationFilter.class);
    }

}
