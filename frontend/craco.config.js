/* craco.config.js */
const CracoAlias = require("craco-alias");

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "options", // (default)
        aliases: {
          "@front": "src",
          "@db": "src/db",
          "@page": "src/page",
          "@feature": "src/feature",
          "@image": "src/res",
          "@style": "src/style"
        }
      }
    }
  ],
  webpack: {
    conigure: {
      externals: {
        sqlite3: "sqlite3",
        mariasql: "mariasql",
        mssql: "mssql",
        mysql: "mysql",
        oracle: "oracle",
        "strong-oracle": "strong-oracle",
        oracledb: "oracledb",
        pg: "pg",
        "pg-query-stream": "pg-query-stream"
      }
    }
  }
};
