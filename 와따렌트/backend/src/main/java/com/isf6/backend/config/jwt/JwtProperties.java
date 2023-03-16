package com.isf6.backend.config.jwt;

public interface JwtProperties {

    String SECRET = "secret-key"; //(2)
    int EXPIRATION_TIME =  864000000; //(3)
    String TOKEN_PREFIX = "Bearer "; //(4)
    String HEADER_STRING = "Authorization"; //(5)

}
