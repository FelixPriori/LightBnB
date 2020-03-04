SELECT properties.*, avg(property_reviews.rating) as average_rating FROM properties
JOIN property_reviews ON properties.id = property_id
WHERE properties.city LIKE '%ancouv%'
GROUP BY property_reviews.property_id, properties.id
HAVING avg(property_reviews.rating) >= 4
ORDER BY properties.cost_per_night
LIMIT 10;