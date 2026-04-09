const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const Listng = require("../models/listing.js");
const MONGO_URL =
  "mongodb+srv://WanderLust:WanderLust@cluster0.detpv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  // initdata.data = initdata.data.map((obj) => ({
  //   ...obj,
  //   owner: "6793af07398fb064017b8a5e",
  // }));
  // await Listng.insertMany(initdata.data);
  // console.log("Data was Initialized");
  console.log("Data was Deleted");
};

initDB();
