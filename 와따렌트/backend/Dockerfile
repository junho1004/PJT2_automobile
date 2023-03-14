FROM openjdk:8-jdk AS Builder
ARG DISABLE_CACHE
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src
RUN chmod +x ./gradlew
RUN ./gradlew bootJAR

FROM openjdk:8-jdk
COPY --from=builder build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]



#FROM openjdk:8-jdk
#EXPOSE 8080
#ARG JAR_FILE=build/libs/backend-0.0.1-SNAPSHOT.jar
#COPY ${JAR_FILE} app.jar
#ENTRYPOINT ["java", "-jar", "/app.jar"]
#ENV TZ=Asia/Seoul
#RUN apt-get install -y tzdata