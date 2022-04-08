drop database if exists routinepi;

create database routinepi;

use routinepi;

create table alarmtime(
  id int auto_increment primary key,
  hour int,
  minute int
);

create table streakcount(
  id int auto_increment primary key,
  streak int
);

insert into alarmtime (hour, minute) values (6, 5);
insert into streakcount (streak) values (0);

-- create table records(
--   id int auto_increment primary key,
--   date_ date,
--   user varchar(50),
--   habit varchar(50),
--   outcome varchar(50)
-- );
-- insert into alarmtime (time_, habit, armed) values ('6:05:00 AM', 'Wake Up', 1);
-- insert into alarmtime (time_, habit, armed) values ('6:05:00 AM', 'Test', 1);
-- mysql -u daurham -p < RoutinePi/piServer/database/schema.sql; // uploads this schema from pi root