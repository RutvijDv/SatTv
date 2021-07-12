import mongoose from "mongoose";
const schema = mongoose.Schema;

const servicesSchema = new schema({
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

const Services = mongoose.model("Services", servicesSchema);

export { Services };
