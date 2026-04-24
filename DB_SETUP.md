TiDB setup and SQL schema

1) Create database and tables (MySQL compatible SQL)

-- Create database
CREATE DATABASE IF NOT EXISTS movie_reviews CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE movie_reviews;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  movie_id VARCHAR(64) NOT NULL,
  user_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  rating TINYINT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

2) Connection notes
- TiDB is MySQL wire compatible. Use a MySQL client or the TiDB Dashboard to run the SQL above.

3) Environment variables (local and Vercel)
- `DATABASE_URL`: MySQL style connection string. Example:
  mysql://username:password@127.0.0.1:4000/movie_reviews
- `JWT_SECRET`: Long random string used to sign JWTs.

Local dev:
- Install TiDB locally or use a managed TiDB Cloud cluster.
- Create the `movie_reviews` database and run the commands above.
- Add a `.env.local` file in project root with:
  DATABASE_URL="mysql://user:pass@127.0.0.1:4000/movie_reviews"
  JWT_SECRET="replace-with-strong-secret"

Vercel:
- In your project settings on Vercel, add the same environment variables `DATABASE_URL` and `JWT_SECRET` under "Environment Variables".
- For serverless functions use the same `DATABASE_URL` value; Vercel will provide it to the server runtime.

4) Migration / seed examples
- Optionally insert an admin user (password hashed using bcrypt):
  INSERT INTO users (username, password_hash) VALUES ('alice', '<bcrypt-hash>');

5) Notes on using driver
- In Node use any MySQL client (e.g., `mysql2` or `knex`) and the connection string from `DATABASE_URL`.
- For serverless deployments prefer connection pooling helpers compatible with serverless (or a database proxy).
