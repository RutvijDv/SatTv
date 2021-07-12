import mongoose from 'mongoose';

const schema = mongoose.Schema;

const basePackSchema = new schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  channels: [String],
  price: {
    type: Number,
    required: true,
  },
});

const BasePack = mongoose.model("BasePack", basePackSchema)

export { BasePack };
