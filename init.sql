-- init.sql
-- Este script se ejecuta automáticamente si el volumen de PostgreSQL está vacío.
-- PostgreSQL ya crea 'asistencia_db' por la variable POSTGRES_DB en docker-compose,
-- por lo que aquí nos aseguramos de crear la segunda base de datos para el backend.

SELECT 'CREATE DATABASE backend_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'backend_db')\gexec
