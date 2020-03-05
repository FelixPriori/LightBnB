const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb',
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {

  const values = [`${email}`];
  const queryString = `
  SELECT * 
  FROM users 
  WHERE email = $1`;
  return pool.query(queryString, values)
    .then(res => {
      let user = res.rows[0];
      if (user) {
        return user;
      }
      return null;
    })
    .catch(e => console.log(e));
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const values = [`${id}`];
  const queryString = `
  SELECT * 
  FROM users 
  WHERE id = $1;
  `;
  return pool.query(queryString, values)
    .then(res => {
      let user = res.rows[0];
      if (user) {
        return user;
      }
      return null;
    })
    .catch(e => console.log(e));
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const values = [`${user.name}`, `${user.email}`, `${user.password}`];
  const queryString = `
    INSERT INTO users (name, email, password) 
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  return pool.query(queryString, values)
    .then(res => res.rows[0])
    .catch(e => console.log(e));
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const values = [`${guest_id}`, `${limit}`];
  const queryString = `
    SELECT properties.*, reservations.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN reservations ON properties.id = property_id
    JOIN property_reviews ON reservations.id = reservation_id
    WHERE reservations.guest_id = $1
      AND reservations.end_date < now()::date
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;
  `;
  return pool.query(queryString, values)
    .then(res => res.rows)
    .catch(e => console.log(e));
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    LEFT JOIN property_reviews ON properties.id = property_id
    `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += options.city || options.minimum_price_per_night && options.maximum_price_per_night
      ? `AND owner_id = $${queryParams.length} `
      : `WHERE owner_id = $${queryParams.length} `
    ;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night * 100}`);
    queryString += options.city || options.owner_id
      ? `AND properties.cost_per_night > $${queryParams.length} `
      : `WHERE properties.cost_per_night > $${queryParams.length} `
    ;
    queryParams.push(`${options.maximum_price_per_night * 100}`);
    queryString += `AND properties.cost_per_night < $${queryParams.length} `;
  }

  // 4
  queryString += `GROUP BY properties.id `
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }
  queryParams.push(limit);
  queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;

  // 5

  return pool.query(queryString, queryParams)
    .then(res => res.rows)
    .catch(e => console.log(e));
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const values = [
    `${property.owner_id}`,
    `${property.title}`,
    `${property.description}`,
    `${property.thumbnail_photo_url}`,
    `${property.cover_photo_url}`,
    `${property.cost_per_night * 100}`,
    `${property.parking_spaces}`,
    `${property.number_of_bathrooms}`,
    `${property.number_of_bedrooms}`,
    `${property.country}`,
    `${property.street}`,
    `${property.city}`,
    `${property.province}`,
    `${property.post_code}`,
  ];
  const queryString = `
    INSERT INTO properties (
      owner_id, 
      title, 
      description, 
      thumbnail_photo_url, 
      cover_photo_url, 
      cost_per_night, 
      parking_spaces, 
      number_of_bathrooms, 
      number_of_bedrooms,
      country, 
      street, 
      city, 
      province, 
      post_code) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;
  return pool.query(queryString, values)
      .then(res => res.rows[0])
      .catch(e => console.log(e));
}
exports.addProperty = addProperty;
