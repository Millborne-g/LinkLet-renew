import mongoose from "mongoose";

// Simple plan types
export enum PlanType {
    FREE = "free",
    PRO = "pro",
}

// Simple billing periods
export enum BillingPeriod {
    MONTHLY = "monthly",
    YEARLY = "yearly",
}


// Subscription status enum
export enum SubscriptionStatus {
    ACTIVE = "active",
    CANCELLED = "cancelled",
    EXPIRED = "expired",
    TRIAL = "trial",
}

const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        plan: {
            type: String,
            enum: Object.values(PlanType),
            required: true,
        },
        billingPeriod: {
            type: String,
            enum: Object.values(BillingPeriod),
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(SubscriptionStatus),
            default: SubscriptionStatus.ACTIVE,
        },
        startDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        endDate: {
            type: Date,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: "USD",
        },
        // Optional fields for future payment integration
        // stripeSubscriptionId: {
        //     type: String,
        //     default: null,
        // },
        // stripeCustomerId: {
        //     type: String,
        //     default: null,
        // },
        // cancelledAt: {
        //     type: Date,
        //     default: null,
        // },
        // cancellationReason: {
        //     type: String,
        //     default: null,
        // },
    },
    {
        timestamps: true,
    }
);

// Indexes for better performance
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 });
subscriptionSchema.index({ endDate: 1 });

const Subscription =
    mongoose.models.Subscription ||
    mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
