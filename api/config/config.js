module.exports = {
  development: {
    username: "postgres",
    database: "colatte_development",
    password: "postgres",
    host: "localhost",
    port: 5432,
    dialect: "postgres",
  },
  test: {
    username: "postgres",
    database: "colatte_test",
    password: "postgres",
    host: "localhost",
    port: 5432,
    dialect: "postgres",
  },
  production: {
    username: process.env.POSTGRES_USERNAME,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
      },
    },
  },
};
