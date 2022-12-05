FROM  adoptopenjdk/openjdk11:jre-11.0.12_7-alpine
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} /target/internFinder-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/target/internFinder-0.0.1-SNAPSHOT.jar"]