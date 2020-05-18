CREATE DATABASE IF NOT EXISTS movies;


CREATE TABLE IF NOT EXISTS users(
                            id INT AUTO_INCREMENT,
                            firstname VARCHAR(255) NOT NULL,
                            lastname VARCHAR(255) NOT NULL,
                            email VARCHAR(320) NOT NULL,
                            password VARCHAR(256) NOT NULL,
                            PRIMARY KEY(id)
                            )


CREATE TABLE IF NOT EXISTS movie(
                                id INT AUTO_INCREMENT,
                                movie_id INT,
                                user_id INT,
                                rate INT,
                                PRIMARY KEY(id),
                                FOREIGN KEY(user_id)
                                    REFERENCES users(id)
                                    ON DELETE CASCADE
                                )