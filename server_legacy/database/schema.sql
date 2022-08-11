drop database if exists routinepi;

create database routinepi;

use routinepi;

create table alarmtime(
  id int auto_increment primary key,
  hour int,
  minute int,
  tod varchar(5)
);

create table streakcount(
  id int auto_increment primary key,
  streak int
);

create table isdefused(
  id int auto_increment primary key,
  defusal int
);

insert into alarmtime (hour, minute) values (6, 5);
insert into streakcount (streak) values (0);
insert into isdefused (defusal) values (0); -- 0 = false, 1 = true

-- insert into alarmtime (hour, minute) values (6, 5);
-- insert into alarmtime (hour, minute) values (10, 5);
-- mysql -u daurham -p < PiRoutine-Pi-Server/server/database/schema.sql // uploads this schema from pi root