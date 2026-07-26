FROM maven:3.9.5-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY common-library ./common-library
COPY user-service ./user-service
RUN mvn clean install -N -DskipTests
RUN mvn clean install -f common-library/pom.xml -DskipTests
RUN mvn clean package -f user-service/pom.xml -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/user-service/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
