CREATE DATABASE IF NOT EXISTS WAD_Y2S3
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

use WAD_Y2S3;

CREATE TABLE users(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL ,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(30) NOT NULL,
    phone_number VARCHAR(20) NOT NULL
);

CREATE TABLE feedbacks{
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    feedback_type VARCHAR(20) NOT NULL,
    feedback_description VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
};

INSERT INTO users (username, email, password, phone_number) VALUES
('KiraYamato', 'kira.yamato@orb.co', 'freedom123', '0123456789'),
('LacusClyne', 'lacus.clyne@plants.zaft', 'pinkharos', '0987654321'),
('AthrunZala', 'athrun.zala@zaft.org', 'justice456', '0112233445'),
('CagalliYula', 'cagalli.orb@orb.co', 'lionheart', '0198765432'),
('MurrueRamius', 'murrue.ramius@earthalliance.mil', 'archangel', '0135792468');
