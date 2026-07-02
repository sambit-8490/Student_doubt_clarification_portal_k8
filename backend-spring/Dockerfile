FROM maven:3.9.2-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml first (to cache dependencies)
COPY pom.xml .

# Download dependencies (maven cache layer)
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the project (creates jar in target/)
RUN mvn clean package -DskipTests

#  Use a lightweight JDK image to run the app
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy the jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port the app will run on
EXPOSE 8085

# Command to run the Spring Boot app
ENTRYPOINT ["java","-jar","app.jar"]
