#!/bin/bash
# Set PostgreSQL password as environment variable
# REPLACE 'your_postgres_password_here' with YOUR actual PostgreSQL password
export DB_PASSWORD='your_postgres_password_here'

# Start the Spring Boot application
./gradlew bootRun

