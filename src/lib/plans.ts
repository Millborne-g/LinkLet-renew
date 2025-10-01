import { PlanType, BillingPeriod } from "../schema/Subscriptions";
import { SubscriptionStatus } from "../schema/Subscriptions";

// Simple plan configuration
export const PLANS = {
    [PlanType.FREE]: {
        name: "Free",
        price: {
            [BillingPeriod.MONTHLY]: 0,
            [BillingPeriod.YEARLY]: 0,
        },
        limits: {
            maxUrls: 10,
            maxCollections: 3,
        },
        features: ["Basic URL shortening", "Collections", "Basic analytics"],
    },
    [PlanType.PRO]: {
        name: "Pro",
        price: {
            [BillingPeriod.MONTHLY]: 9.99,
            [BillingPeriod.YEARLY]: 99.99, // ~17% discount
        },
        limits: {
            maxUrls: -1, // unlimited
            maxCollections: -1,
        },
        features: [
            "Unlimited URLs",
            "Unlimited collections",
            "Advanced analytics",
            "Custom domains",
            "Priority support",
            "API access",
        ],
    },
} as const;

// Helper functions
export const getPlanPrice = (
    plan: PlanType,
    billingPeriod: BillingPeriod
): number => {
    return PLANS[plan].price[billingPeriod];
};

export const isSubscriptionActive = (subscription: any): boolean => {
    if (!subscription) return false;
    return (
        subscription.status === SubscriptionStatus.ACTIVE &&
        new Date() < subscription.endDate
    );
};

export const canCreateUrl = (user: any): boolean => {
    if (!user.currentSubscription) {
        // Free plan limits
        return user.urlsCreated < PLANS[PlanType.FREE].limits.maxUrls;
    }

    const subscription = user.currentSubscription;
    if (subscription.plan === PlanType.PRO) {
        return true; // unlimited
    }

    return (
        user.urlsCreated < PLANS[subscription.plan as PlanType].limits.maxUrls
    );
};

export const getSubscriptionEndDate = (billingPeriod: BillingPeriod): Date => {
    const now = new Date();
    if (billingPeriod === BillingPeriod.YEARLY) {
        return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    } else {
        return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }
};
