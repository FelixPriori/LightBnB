SELECT properties.*, reservations.*, avg(property_reviews.rating) as average_rating
FROM properties
JOIN reservations ON properties.id = property_id
JOIN property_reviews ON reservations.id = reservation_id
WHERE reservations.guest_id = 1
  AND reservations.end_date < now()::date
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT 10;