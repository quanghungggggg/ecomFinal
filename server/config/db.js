const mongoose = require("mongoose");
try {
  console.log(process.env.DB_CLOUD);
  mongoose.connect(process.env.DB_CLOUD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  console.log("Database Connected Successfully");
} catch (err) {
  console.log("Database Not Connected");
}
