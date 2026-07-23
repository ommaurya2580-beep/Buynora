FROM maven:3.9.5-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY common-library ./common-library
COPY authentication-service ./authentication-service
RUN mvn clean install -f common-library/pom.xml -DskipTests
RUN mvn clean package -f authentication-service/pom.xml -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/authentication-service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
