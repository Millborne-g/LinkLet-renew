// Migration script to add subscription fields to existing users and create subscriptions collection
// Run this with: node src/scripts/migrate-subscriptions.js

const mongoose = require("mongoose");
require("dotenv").config();

// Define the updated user schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    userImage: { type: String },
    // New subscription fields
    currentSubscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
        default: null,
    },
    subscriptionHistory: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
    ],
    isActive: { type: Boolean, default: true },
});

// Define the new subscription schema
const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        plan: { type: String, enum: ["free", "pro"], required: true },
        billingPeriod: {
            type: String,
            enum: ["monthly", "yearly"],
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "cancelled", "expired", "trial"],
            default: "active",
        },
        startDate: { type: Date, required: true, default: Date.now },
        endDate: { type: Date, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: "USD" },
        stripeSubscriptionId: { type: String, default: null },
        stripeCustomerId: { type: String, default: null },
        cancelledAt: { type: Date, default: null },
        cancellationReason: { type: String, default: null },
    },
    {
        timestamps: true,
    }
);

// Add indexes for subscriptions
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 });
subscriptionSchema.index({ endDate: 1 });

const User = mongoose.model("User", userSchema);
const Subscription = mongoose.model("Subscription", subscriptionSchema);

async function migrateSubscriptions() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Step 1: Add new fields to existing users
        console.log("Adding subscription fields to existing users...");

        const usersWithoutSubscriptionFields = await User.find({
            $or: [
                { currentSubscription: { $exists: false } },
                { subscriptionHistory: { $exists: false } },
                { isActive: { $exists: false } },
            ],
        });

        console.log(
            `Found ${usersWithoutSubscriptionFields.length} users without subscription fields`
        );

        if (usersWithoutSubscriptionFields.length > 0) {
            const result = await User.updateMany(
                {
                    $or: [
                        { currentSubscription: { $exists: false } },
                        { subscriptionHistory: { $exists: false } },
                        { isActive: { $exists: false } },
                    ],
                },
                {
                    $set: {
                        currentSubscription: null,
                        subscriptionHistory: [],
                        isActive: true,
                    },
                }
            );

            console.log(
                `Updated ${result.modifiedCount} users with subscription fields`
            );
        } else {
            console.log("All users already have subscription fields");
        }

        // Step 2: Create subscriptions collection indexes
        console.log("Creating indexes for subscriptions collection...");

        try {
            await Subscription.collection.createIndex({ userId: 1, status: 1 });
            await Subscription.collection.createIndex({
                stripeSubscriptionId: 1,
            });
            await Subscription.collection.createIndex({ endDate: 1 });
            console.log("Subscription indexes created successfully");
        } catch (indexError) {
            console.log("Indexes may already exist:", indexError.message);
        }

        // Step 3: Create default free subscriptions for existing users (optional)
        console.log(
            "Creating default free subscriptions for existing users..."
        );

        const usersWithoutSubscriptions = await User.find({
            currentSubscription: null,
        });

        console.log(
            `Found ${usersWithoutSubscriptions.length} users without subscriptions`
        );

        if (usersWithoutSubscriptions.length > 0) {
            const freeSubscriptions = [];
            const now = new Date();
            const oneYearFromNow = new Date(
                now.getFullYear() + 1,
                now.getMonth(),
                now.getDate()
            );

            for (const user of usersWithoutSubscriptions) {
                const freeSubscription = {
                    userId: user._id,
                    plan: "free",
                    billingPeriod: "yearly",
                    status: "active",
                    startDate: now,
                    endDate: oneYearFromNow,
                    amount: 0,
                    currency: "USD",
                };
                freeSubscriptions.push(freeSubscription);
            }

            if (freeSubscriptions.length > 0) {
                const createdSubscriptions = await Subscription.insertMany(
                    freeSubscriptions
                );
                console.log(
                    `Created ${createdSubscriptions.length} free subscriptions`
                );

                // Update users with their subscription references
                for (let i = 0; i < usersWithoutSubscriptions.length; i++) {
                    const user = usersWithoutSubscriptions[i];
                    const subscription = createdSubscriptions[i];

                    await User.findByIdAndUpdate(user._id, {
                        currentSubscription: subscription._id,
                        subscriptionHistory: [subscription._id],
                    });
                }
                console.log("Updated users with subscription references");
            }
        } else {
            console.log("All users already have subscriptions");
        }

        console.log("Migration completed successfully!");

        // Display summary
        const totalUsers = await User.countDocuments();
        const totalSubscriptions = await Subscription.countDocuments();
        const activeSubscriptions = await Subscription.countDocuments({
            status: "active",
        });

        console.log("\nSummary:");
        console.log(`- Total users: ${totalUsers}`);
        console.log(`- Total subscriptions: ${totalSubscriptions}`);
        console.log(`- Active subscriptions: ${activeSubscriptions}`);
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

migrateSubscriptions();

