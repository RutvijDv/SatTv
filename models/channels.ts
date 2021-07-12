import mongoose from "mongoose";
const schema = mongoose.Schema;

const channelsSchema = new schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Channels = mongoose.model("Channels", channelsSchema);

export { Channels};