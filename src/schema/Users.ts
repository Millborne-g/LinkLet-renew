import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    userImage: {
        type: String,
    },
    // Subscription reference
    currentSubscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
        default: null,
    },
    subscriptionHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subscription",
        },
    ],
    isActive: {
        type: Boolean,
        default: true,
    },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
