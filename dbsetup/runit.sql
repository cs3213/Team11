DROP SCHEMA IF EXISTS cs3213_schema;
CREATE SCHEMA cs3213_schema;
DROP USER 'cs3213_user'@'localhost';
CREATE USER 'cs3213_user'@'localhost' IDENTIFIED BY 'cs3213!!';
GRANT ALL ON cs3213_schema . * TO 'cs3213_user'@'localhost';
USE cs3213_schema;
CREATE TABLE google_user (
	id					VARCHAR(32) UNIQUE NOT NULL,
	name				VARCHAR(64),
	email				VARCHAR(128) UNIQUE,
	image_url			TEXT,
	PRIMARY KEY(id)
);
CREATE TABLE saved_programs (
	google_user_id		VARCHAR(32) UNIQUE NOT NULL,
	saved_data			TEXT,
	lmodified			TIMESTAMP DEFAULT NOW(),
	FOREIGN KEY(google_user_id) REFERENCES google_user(id) ON UPDATE CASCADE
);