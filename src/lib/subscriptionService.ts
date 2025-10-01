import Subscription from "../schema/Subscriptions";
import User from "../schema/Users";
import { PlanType, BillingPeriod } from "../schema/Subscriptions";
import { SubscriptionStatus } from "../schema/Subscriptions";
import { getPlanPrice, getSubscriptionEndDate } from "./plans";

// Create a new subscription
export const createSubscription = async (
    userId: string,
    plan: PlanType,
    billingPeriod: BillingPeriod
) => {
    try {
        const amount = getPlanPrice(plan, billingPeriod);
        const endDate = getSubscriptionEndDate(billingPeriod);

        const subscription = await Subscription.create({
            userId,
            plan,
            billingPeriod,
            amount,
            endDate,
            status: SubscriptionStatus.ACTIVE,
        });

        // Update user's current subscription
        await User.findByIdAndUpdate(userId, {
            currentSubscription: subscription._id,
            $push: { subscriptionHistory: subscription._id },
        });

        return subscription;
    } catch (error) {
        console.error("Error creating subscription:", error);
        throw error;
    }
};

// Cancel a subscription
export const cancelSubscription = async (
    subscriptionId: string,
    reason?: string
) => {
    try {
        const subscription = await Subscription.findByIdAndUpdate(
            subscriptionId,
            {
                status: SubscriptionStatus.CANCELLED,
                cancelledAt: new Date(),
                cancellationReason: reason,
            },
            { new: true }
        );

        return subscription;
    } catch (error) {
        console.error("Error cancelling subscription:", error);
        throw error;
    }
};

// Get user's current subscription details
export const getUserSubscription = async (userId: string) => {
    try {
        const user = await User.findById(userId)
            .populate("currentSubscription")
            .populate("subscriptionHistory");

        return {
            current: user?.currentSubscription,
            history: user?.subscriptionHistory || [],
        };
    } catch (error) {
        console.error("Error getting user subscription:", error);
        return null;
    }
};
