import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { GET_USERS, GET_SUBSCRIPTION, GET_SUBSCRIPTIONS, CHARGE_SUBSCRIPTION, UPDATE_SUBSCRIPTION } from '../graphql/graphql.queries';


@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {
  users: any[] = [];
  subscriptions: any[] = [];
  error: any;

  subscriptionsForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  getSubscriptions() {

  }

  updateSubscription() {
        // apollo graphql query to update a subscription
        this.apollo.mutate({
          mutation: UPDATE_SUBSCRIPTION,
          variables: {
            donation: {}
          },
          refetchQueries: [{
            query: GET_SUBSCRIPTIONS
          }]
        }).subscribe(({data}: any) => {
          this.subscriptions = data.subscriptions;
          this.subscriptionsForm.reset();
        }
        , (error) => {
          this.error = error;
        }
        );
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
