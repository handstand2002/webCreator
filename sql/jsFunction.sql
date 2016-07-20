DROP DATABASE IF EXISTS webCreator;
CREATE DATABASE webCreator;
USE webCreator;

CREATE TABLE classGroup (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	parentid int NULL DEFAULT NULL,
	ispage boolean DEFAULT False,
	title varchar(30) UNIQUE,
	
	FOREIGN KEY (parentid) REFERENCES classGroup(id)
);

CREATE TABLE classFunction (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	groupid int NOT NULL,
	text blob,
	
	FOREIGN KEY (groupid) REFERENCES classGroup(id)
);

CREATE TABLE css (
	groupid int NOT NULL PRIMARY KEY,
	text blob,
	
	FOREIGN KEY (groupid) REFERENCES classGroup(id)
);

CREATE TABLE html (
	groupid int NOT NULL PRIMARY KEY,
	text blob,
	
	FOREIGN KEY (groupid) REFERENCES classGroup(id)
);
