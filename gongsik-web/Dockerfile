FROM openjdk:17-jdk
LABEL maintainer="email"
ARG JAR_FILE=/docker-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} docker-springboot.jar
ENTRYPOINT ["java","-jar","/docker-springboot.jar"]