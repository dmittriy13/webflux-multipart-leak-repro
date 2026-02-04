FROM eclipse-temurin:21-jre

WORKDIR /app
COPY target/webflux-multipart-leak-repro-0.0.1-SNAPSHOT.jar /app/app.jar

EXPOSE 7878
ENTRYPOINT ["java","-jar","/app/app.jar"]
