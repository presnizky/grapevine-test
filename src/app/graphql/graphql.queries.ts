import {gql} from 'apollo-angular'

const GET_USERS = gql`
    query Users {
        users {
            id
            firstName
            lastName
        }
    }
`

const GET_SUBSCRIPTION = gql`
    query Subscription($userId: ID!, $subscriptionId: ID!) {
        subscription(userId: $userId, subscriptionId: $subscriptionId) {
            id
            user {
            firstName
            lastName
            }
            startDate
            interval
            paymentMethod {
            name
            creditCardNumber
            expirationDate
            ccv
            }
            amount
            nextPaymentDate
            totalDonated    
        }
    }
`

const GET_SUBSCRIPTIONS = gql`
    query Subscriptions($userId: ID!) {
        subscriptions(userId: $userId) {
            id
            amount
            interval
            nextPaymentDate
            paymentMethod {
            id
            name
            creditCardNumber
            }
            totalDonated
        }
    }
`

const CHARGE_SUBSCRIPTION = gql`
    mutation Charge_subscription($donation: DonationInput!) {
        charge_subscription(donation: $donation) {
            id
            user {
            firstName
            lastName
            }
            startDate
            interval
            paymentMethod {
            name
            creditCardNumber
            expirationDate
            ccv
            }
            amount
            nextPaymentDate
            totalDonated
        }    
    }
`

const UPDATE_SUBSCRIPTION = gql`
    mutation Update_subscription($subscription: SubscriptionInput!) {
        update_subscription(subscription: $subscription) {
            id
            user {
            firstName
            lastName
            }
            startDate
            interval
            paymentMethod {
            name
            creditCardNumber
            expirationDate
            ccv
            }
            amount
            nextPaymentDate
            totalDonated
        }
    }
`

export {GET_USERS, GET_SUBSCRIPTION, GET_SUBSCRIPTIONS, CHARGE_SUBSCRIPTION, UPDATE_SUBSCRIPTION}
