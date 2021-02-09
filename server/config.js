module.exports = {
  dbConnection: {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "algo",
    password: "algo",
    database: "toptal",
    synchronize: true,
    logging: false,
  },
  authSecret: "some-secret-ideally-in-env-variable-or-in-file",
  tokenExpiresIn: 20 * 60, //secs
};
