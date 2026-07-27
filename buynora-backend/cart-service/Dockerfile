FROM maven:3.9.5-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY common-library ./common-library
COPY cart-service ./cart-service
RUN mvn clean install -N -DskipTests
RUN mvn clean install -f common-library/pom.xml -DskipTests
RUN mvn clean package -f cart-service/pom.xml -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/cart-service/target/*.jar app.jar
EXPOSE 8089
ENTRYPOINT ["java", "-jar", "app.jar"]
