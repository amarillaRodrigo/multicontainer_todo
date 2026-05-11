const mongoose = require("mongoose");
const { createApp } = require("./app");

const app = createApp();
const port = process.env.PORT ?? 3000;
const mongoUri = process.env.MONGO_URI ?? "mongodb://localhost:27017/todos";

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  });
