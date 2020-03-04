INSERT INTO users (name, email, password) 
VALUES ('Frank', 'frank@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Bernie', 'bernie@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Hank', 'hank@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms,country, street, city, province, post_code) 
VALUES (1, 'Joes Garage', 'v good place', 'http://thumbnail.com', 'http://cover.com', 60, 1, 1, 2, 'USA', 'rainbow road', 'Baltimore', 'Maryland', '11111' ),
(2, 'bernie@example.com', 'facyy', 'http://thumbnail.com', 'http://cover.com', 120, 3, 3, 4, 'USA', 'yellow brick road', 'Brooklyn', 'New York', '12121'),
(3, 'hank@example.com', 'that place tho', 'http://thumbnail.com', 'http://cover.com', 42, 2, 2, 3, 'USA', 'abbey road', 'Missoula', 'Montana', '23132');

INSERT INTO reservations (guest_id, property_id, start_date, end_date) 
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) 
VALUES (1, 1, 1, 5, 'message'),
(2, 2, 2, 5, 'message'),
(3, 3, 3, 5, 'message');