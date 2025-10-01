// Migration script to clear free subscriptions and create pro subscriptions for specific users
// Run this with: node src/scripts/migrate-pro-subscriptions.js

const mongoose = require("mongoose");
require("dotenv").config();

// Define the user schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    userImage: { type: String },
    // Subscription fields
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

// Define the subscription schema
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
    },
    {
        timestamps: true,
    }
);

// Add indexes for subscriptions
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 });

const User = mongoose.model("User", userSchema);
const Subscription = mongoose.model("Subscription", subscriptionSchema);

// Pro plan pricing
const PRO_PRICING = {
    monthly: 9.99,
    yearly: 99.99,
};

async function migrateProSubscriptions() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Step 1: Clear all existing subscriptions
        console.log("Clearing all existing subscriptions...");
        const deleteResult = await Subscription.deleteMany({});
        console.log(
            `Deleted ${deleteResult.deletedCount} existing subscriptions`
        );

        // Step 2: Reset all users' subscription fields to null/empty
        console.log("Resetting all users' subscription fields...");
        const resetResult = await User.updateMany(
            {},
            {
                $set: {
                    currentSubscription: null,
                    subscriptionHistory: [],
                },
            }
        );
        console.log(
            `Reset subscription fields for ${resetResult.modifiedCount} users`
        );

        // Step 3: Create pro subscriptions for specific users
        console.log("Creating pro subscriptions for specified users...");

        const now = new Date();

        // User 1: Pro Monthly
        const monthlyEndDate = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            now.getDate()
        );
        const monthlySubscription = new Subscription({
            userId: new mongoose.Types.ObjectId("68c5b445bea082fa90c3abeb"),
            plan: "pro",
            billingPeriod: "monthly",
            status: "active",
            startDate: now,
            endDate: monthlyEndDate,
            amount: PRO_PRICING.monthly,
            currency: "USD",
        });

        // User 2: Pro Yearly
        const yearlyEndDate = new Date(
            now.getFullYear() + 1,
            now.getMonth(),
            now.getDate()
        );
        const yearlySubscription = new Subscription({
            userId: new mongoose.Types.ObjectId("68c5c251bea082fa90c3ac78"),
            plan: "pro",
            billingPeriod: "yearly",
            status: "active",
            startDate: now,
            endDate: yearlyEndDate,
            amount: PRO_PRICING.yearly,
            currency: "USD",
        });

        // Save subscriptions
        const [savedMonthly, savedYearly] = await Promise.all([
            monthlySubscription.save(),
            yearlySubscription.save(),
        ]);

        console.log(`Created pro monthly subscription: ${savedMonthly._id}`);
        console.log(`Created pro yearly subscription: ${savedYearly._id}`);

        // Step 4: Update users with their subscription references
        console.log("Updating users with subscription references...");

        await Promise.all([
            User.findByIdAndUpdate("68c5b445bea082fa90c3abeb", {
                currentSubscription: savedMonthly._id,
                subscriptionHistory: [savedMonthly._id],
            }),
            User.findByIdAndUpdate("68c5c251bea082fa90c3ac78", {
                currentSubscription: savedYearly._id,
                subscriptionHistory: [savedYearly._id],
            }),
        ]);

        console.log("Updated users with subscription references");

        console.log("Migration completed successfully!");

        // Display summary
        const totalUsers = await User.countDocuments();
        const totalSubscriptions = await Subscription.countDocuments();
        const proSubscriptions = await Subscription.countDocuments({
            plan: "pro",
        });
        const monthlyProSubscriptions = await Subscription.countDocuments({
            plan: "pro",
            billingPeriod: "monthly",
        });
        const yearlyProSubscriptions = await Subscription.countDocuments({
            plan: "pro",
            billingPeriod: "yearly",
        });

        console.log("\nSummary:");
        console.log(`- Total users: ${totalUsers}`);
        console.log(`- Total subscriptions: ${totalSubscriptions}`);
        console.log(`- Pro subscriptions: ${proSubscriptions}`);
        console.log(`- Pro monthly subscriptions: ${monthlyProSubscriptions}`);
        console.log(`- Pro yearly subscriptions: ${yearlyProSubscriptions}`);

        // Verify the specific users
        const monthlyUser = await User.findById(
            "68c5b445bea082fa90c3abeb"
        ).populate("currentSubscription");
        const yearlyUser = await User.findById(
            "68c5c251bea082fa90c3ac78"
        ).populate("currentSubscription");

        console.log("\nVerification:");
        console.log(
            `- User 68c5b445bea082fa90c3abeb (Monthly Pro): ${monthlyUser?.currentSubscription?.plan} ${monthlyUser?.currentSubscription?.billingPeriod}`
        );
        console.log(
            `- User 68c5c251bea082fa90c3ac78 (Yearly Pro): ${yearlyUser?.currentSubscription?.plan} ${yearlyUser?.currentSubscription?.billingPeriod}`
        );
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

migrateProSubscriptions();
