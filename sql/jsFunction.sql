DROP DATABASE IF EXISTS webCreator;
CREATE DATABASE webCreator;
USE webCreator;

CREATE TABLE jsGroup (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	parentid int NULL,
	ispage boolean DEFAULT False,
	
	FOREIGN KEY (parentid) REFERENCES jsGroup(id)
);

CREATE TABLE jsFunction (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	groupid int NOT NULL,
	text blob,
	
	FOREIGN KEY (groupid) REFERENCES jsGroup(id)
);

CREATE TABLE css (
	groupid int NOT NULL PRIMARY KEY,
	text blob,
	
	FOREIGN KEY (groupid) REFERENCES jsGroup(id)
);

CREATE TABLE html (
	groupid int NOT NULL PRIMARY KEY,
	text blob,
	
	FOREIGN KEY (groupid) REFERENCES jsGroup(id)
);