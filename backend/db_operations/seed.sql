INSERT INTO users (username, email, password, phone_number) VALUES
('alice', 'alice@example.com', '$2b$10$5dNzLZ2K.5jlwFmjVQhAbeqUOgEdxWz/N5uIZ1m3sNDsKe0zFAj7q', '012-3456789'),
('bob', 'bob@example.com', '$2b$10$hD/dRZgAyoFSZEQy6LgN..4CuLOi8i3zBQ6S/t.5HOnE3Afvvij.2', '013-8765432'),
('charlie', 'charlie@example.com', '$2b$10$whLK/qcMsp1bUhzUYfrl0emUtQ1QvWgOc1zZ9AxxOLoP0NITlyd.e', '014-1111222');
--  for the pw, its password123, securepass, charliepwd

INSERT INTO shelves (user_id, name) VALUES
(1, 'Favorites'),
(2, 'To Read'),
(3, 'Finished');

INSERT INTO shelf_books (user_id, book_id, shelf_id) VALUES
(1, 101, 1),
(2, 102, 2),
(3, 103, 3);

INSERT INTO messages (room_id, user_id, msg, timestamp) VALUES
(101, 1, 'Just finished reading this book!', '2025-05-10 10:00:00'),
(101, 2, 'What did you think of the ending?', '2025-05-10 10:05:00'),
(102, 3, 'This book is on my list!', '2025-05-10 10:10:00');

INSERT INTO feedbacks (user_id, feedback_type, feedback_description) VALUES
(1, 'Problems', 'The app crashes when I add a new shelf.'),
(2, 'Suggestions', 'Can we have dark mode?');

INSERT INTO view_record (user_id, book_id) VALUES
(1, 101),
(2, 102),
(3, 103);