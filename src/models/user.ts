export default interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    isPrivileged: boolean;
    isSubscriptionSetToEnd: boolean;
    subscriptionEndDate: string|null;
}