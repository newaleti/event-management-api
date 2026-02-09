import mongoose from "mongoose";

const mosqueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    // For Map integration
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], required: true }, // [Longitude, Latitude]
    },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // The Mosque Admin
    description: { type: String },
    image: { type: String },
  },
  { timestamps: true },
);

// This index allows us to search for mosques "near" a user's location
mosqueSchema.index({ location: "2dsphere" });

export default mongoose.model("Mosque", mosqueSchema);
