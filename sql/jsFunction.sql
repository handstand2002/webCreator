DROP DATABASE IF EXISTS webCreator;
CREATE DATABASE webCreator;
USE webCreator;

CREATE TABLE classGroup (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	parentid int NULL DEFAULT NULL,
	ispage boolean DEFAULT False,
	title varchar(30),
	
	UNIQUE `test` (parentid, title),
	FOREIGN KEY (parentid) REFERENCES classGroup(id)
);

CREATE TABLE classFunction (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	groupid int NOT NULL,
	text blob,
	
	FOREIGN KEY (groupid) REFERENCES classGroup(id)
);

CREATE TABLE area (
	areaid int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	title varchar(30)
);

CREATE TABLE groupInArea (
	areaid int NOT NULL,
	groupid int NOT NULL,
	
	PRIMARY KEY(areaid, groupid),
	FOREIGN KEY (areaid) REFERENCES area(areaid),
	FOREIGN KEY (groupid) REFERENCES classGroup(id)
);

CREATE TABLE functionInArea (
	areaid int NOT NULL,
	functionid int NOT NULL,
	
	PRIMARY KEY(areaid, functionid),
	FOREIGN KEY (areaid) REFERENCES area(areaid),
	FOREIGN KEY (functionid) REFERENCES classFunction(id)
);
