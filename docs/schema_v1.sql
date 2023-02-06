CREATE TABLE customer(
   id INT AUTO_INCREMENT,
   email VARCHAR(255),
   pincode VARCHAR(255),
   is_deleted BOOLEAN,
   PRIMARY KEY(id)
);

CREATE TABLE priority(
   id INT AUTO_INCREMENT,
   label VARCHAR(255),
   color VARCHAR(255),
   PRIMARY KEY(id)
);

CREATE TABLE todo(
   id INT AUTO_INCREMENT,
   title VARCHAR(255),
   description TEXT,
   is_favorite BOOLEAN,
   is_deleted BOOLEAN,
   id_customer INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_customer) REFERENCES customer(id)
);

CREATE TABLE task(
   id INT AUTO_INCREMENT,
   title VARCHAR(255),
   deadline_date DATETIME,
   is_completed BOOLEAN,
   is_deleted BOOLEAN,
   id_priority INT NOT NULL,
   id_Todo INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_priority) REFERENCES priority(id),
   FOREIGN KEY(id_Todo) REFERENCES todo(id)
);
