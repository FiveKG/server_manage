CREATE USER dbuser WITH PASSWORD 'pass_2019';
CREATE DATABASE yue_manage OWNER dbuser;
GRANT ALL PRIVILEGES ON DATABASE yue_manage TO dbuser;