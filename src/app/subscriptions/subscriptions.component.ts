import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { GET_USERS, GET_SUBSCRIPTIONS, UPDATE_SUBSCRIPTION } from '../graphql/graphql.queries';

interface SubscriptionResponse {
  subscriptions: Subscription[];
}

interface Subscription {
  id: number;
  user: User;
  startDate: Date;
  interval: string;
  paymentMethod?: PaymentMethod;
  amount: number;
  nextPaymentDate?: Date;
  totalDonated?: number;
}

interface PaymentMethod {
  id: number;
  name: String;
  creditCardNumber: String;
  expirationDate: Date;
  ccv: number;
}

interface User {
  id: number;
  firstName: string;
  lastname: string;
}


@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {
  @Input() subscriptions: any[] = [];
  users: any[] = [];
  editedSubscription: any;
  editingSubscriptionId: number = -1;
  editingField: string = '';
  isEditing: boolean = false;
  subscriptionsPerPage = 2;
  currentSubscriptionIndex = 0;
  name = 'ddlUsers';
  label = 'Select a user: ';
  error: any;

  subscriptionsForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  getPaymentMethod(subscription: Subscription): string {
    if (!subscription || !subscription.paymentMethod) {
      return '';
    }
    const paymentMethod = subscription.paymentMethod;
    return `${paymentMethod.name} ending in ${paymentMethod.creditCardNumber.slice(-4)}`;
  }

  getTotalDonated(subscription: Subscription): string {
    if (!subscription) {
      return '';
    }
    const totalDonated = subscription.totalDonated || 0;
    const startDate = new Date(subscription.startDate).toLocaleDateString("en-US");
    return `${totalDonated.toLocaleString('en-US', {style: 'currency', 'currency': 'USD'})} since ${startDate}`;
  }

  startEditing(subscription: Subscription, field: string): void {
    this.isEditing = true;
    this.editingSubscriptionId = subscription.id;
    this.editingField = field;
    this.editedSubscription = Object.assign({}, subscription);
  }

  stopEditing(): void {
    this.isEditing = false;
    this.editingSubscriptionId = -1;
    this.editingField = '';
    this.editedSubscription = null;
  }

  onOptionSelected(event: any) {
    this.error = '';
    this.subscriptionsPerPage = 2;
    this.currentSubscriptionIndex = 0;
    const userId = event.target.value;
    this.apollo.watchQuery<SubscriptionResponse>({ query: GET_SUBSCRIPTIONS, variables: { userId } }).valueChanges.subscribe(result => {
      this.subscriptions = [...result.data.subscriptions];
    });
  }

  updateSubscription(subscription: Subscription) {
     // apollo graphql query to update a subscription
    const nextPaymentDate = subscription.nextPaymentDate !== undefined ? new Date(subscription.nextPaymentDate) : subscription.nextPaymentDate;

    this.apollo.mutate({
      mutation: UPDATE_SUBSCRIPTION,
      variables: {
        subscription: {
          id: subscription.id,
          userId: subscription.user.id,
          amount: subscription.amount,
          interval: subscription.interval,
          nextPaymentDate
        }
      }
      }).subscribe(({data}: any) => {
        const updatedSubscription = this.subscriptions.find(s => s.id===data.update_subscription.id); 
        this.subscriptions[updatedSubscription] = data.update_subscription;
        this.subscriptionsForm.reset();
        this.stopEditing();
      }
      , (error) => {
        this.error = error;
      }
    );
  }

  showMore(): void {
    this.currentSubscriptionIndex += this.subscriptionsPerPage;
  }

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: GET_USERS
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.users = data.users;
      this.error = error;
    }
    );
  }
}
