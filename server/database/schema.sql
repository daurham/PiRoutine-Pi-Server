DROP DATABASE IF EXISTS piroutine;

CREATE DATABASE piroutine;

USE piroutine;

CREATE TABLE alarmtime(
  id INT auto_increment PRIMARY KEY,
  hour INT,
  minute INT,
  tod VARCHAR(5)
);

DROP TABLE IF EXISTS streakcount;
CREATE TABLE streakcount(
  id INT auto_increment PRIMARY KEY,
  streak INT,
  maxstreak INT
);

DROP TABLE IF EXISTS isdisarmed;
CREATE TABLE isdisarmed(
  id INT auto_increment PRIMARY KEY,
  disarmedstatus INT
);

DROP TABLE IF EXISTS soakedcount;
CREATE TABLE soakedcount(
  id INT auto_increment PRIMARY KEY,
  soaked INT
);

DROP TABLE IF EXISTS skippedcount;
CREATE TABLE skippedcount(
  id INT auto_increment PRIMARY KEY,
  skipped INT,
  skipdate VARCHAR(20)
);

DROP TABLE IF EXISTS users;
CREATE TABLE users(
  id INT auto_increment,
  username VARCHAR(30),
  password_ VARCHAR(20),
  CONSTRAINT uq_user UNIQUE (username),
  PRIMARY KEY (id, username)
);

DROP TABLE IF EXISTS disarmrecords;
CREATE TABLE disarmrecords(
  id INT auto_increment PRIMARY KEY,
  date_ VARCHAR(20),
  alarm1 VARCHAR(20),
  alarm2 VARCHAR(20),
  disarmedtime1 VARCHAR(20),
  disarmedtime2 VARCHAR(20),
  success INT,
  username VARCHAR(30),
  FOREIGN KEY (username)
    REFERENCES users(username)
);

INSERT INTO alarmtime (hour, minute, tod) VALUES (6, 5, 'AM');
INSERT INTO streakcount (streak, maxstreak) VALUES (0, 0);
INSERT INTO isdisarmed (disarmedstatus) VALUES (0); -- 0 = false, 1 = true
INSERT INTO users (username, password_) VALUES ('testuser', '1234');
INSERT INTO users (username, password_) VALUES ('daurham', '1234');
INSERT INTO soakedcount (soaked) VALUES (0);
INSERT INTO skippedcount (skipped) VALUES (0);
INSERT INTO disarmrecords (date_, alarm1, alarm2, disarmedtime1, disarmedtime2, success, username) VALUES ('8/20/2022', '5:10:00 AM', '5:17:00 AM', '5:05:00 AM', '5:15:00 AM', 1, 'daurham');

-- INSERT INTO alarmtime (hour, minute) VALUES (6, 5);
-- INSERT INTO alarmtime (hour, minute) VALUES (10, 5);
-- mysql -u daurham -p < PiRoutine-Pi-Server/server/database/schema.sql // uploads this schema from pi root
-- mysql -u daurham -p < PiRoutine-Pi-Server/server/database/schema.sql

-- rmysql < PiRoutine-Pi-Server/server/database/schema.sql
-- // uploads this schema from pi root
