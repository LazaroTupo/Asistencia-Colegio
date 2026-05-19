-- init.sql
-- Este script se ejecuta automáticamente si el volumen de PostgreSQL está vacío.

SELECT 'CREATE DATABASE backend_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'backend_db')\gexec

SELECT 'CREATE DATABASE evolution_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'evolution_db')\gexec
