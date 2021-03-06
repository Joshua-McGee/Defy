DROP TABLE IF EXISTS locations CASCADE;
CREATE TABLE locations (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  lat DECIMAL NOT NULL,
  long DECIMAL NOT NULL,
  zoom INTEGER NOT NULL DEFAULT 11,
  address VARCHAR(255) NOT NULL
);
