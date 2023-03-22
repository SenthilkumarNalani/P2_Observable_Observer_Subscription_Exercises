import { Observable } from 'rxjs';

// Example 1: Empty Observable with Subscription
// Note: The takeaway from this exercise is that the subscribe method immediately runs the logic inside of the Observable. So it's not asynchronous or delayed in any way.
// Output:
// Before Subscribe
// Observable Executed!
// After Subscribe

// const observable$ = new Observable((subscriber) => {
//   console.log('Observable Executed!');
// });

// console.log('Before Subscribe');
// observable$.subscribe();
// console.log('After Subscribe');

// Example 2: Synchronous Emission - Next Notification
// The new instance of observable is created and assigned to observable$
// Then we can see the console log just before calling subscribe method was run, then we subscribe.
// Then, the Observable logic was instantly executed. Then, the next notification was emitted and the handler for the next notifications was called, which console logged the value.
// And after that, the console log which is placed just after calling the subscribe method, was run.
// The important thing to notice here is that the emitted values are passed to the Observer's next notification handler immediately, in a synchronous way. In the next example we'll add more emissions

// Output:
// Before Subscribe
// Observable Executed!
// Mahi Chenchith
// After Subscribe
// const observable$ = new Observable<string>((subscriber) => {
//   console.log('Observable Executed!');
//   subscriber.next('Mahi Chenchith');
// });

// console.log('Before Subscribe');
// observable$.subscribe((value: string) => console.log(value));
// console.log('After Subscribe');

// Example 3: Asynchronous Emissions - more next notifications
// We can say that the delayed value 'Chenchu Lakshmi' was handled asynchronously.
// The thing to remember from this exercise is that the Observable can emit notifications in both, synchronous and asynchronous way.

// Output:
// Before Subscribe
// Observable Executed!
// Mahi Chenchith
// Mahathi
// After Subscribe
// Chenchu Lakshmi
// const observable$ = new Observable<string>((subscriber) => {
//   console.log('Observable Executed!');
//   subscriber.next('Mahi Chenchith');
//   subscriber.next('Mahathi');
//   setTimeout(() => {
//     subscriber.next('Chenchu Lakshmi');
//   }, 2000);
// });

// console.log('Before Subscribe');
// observable$.subscribe((value: string) => console.log(value));
// console.log('After Subscribe');

// Example 4: Teardown - Complete Notification
// Sample 1: Complete Notification
// Output:
// Before Subscribe
// Observable Executed!
// Mahi Chenchith
// Mahathi
// After Subscribe
// Chenchu Lakshmi
// Subscription completed!

// const observable$ = new Observable<string>((subscriber) => {
//   console.log('Observable Executed!');
//   subscriber.next('Mahi Chenchith');
//   subscriber.next('Mahathi');
//   setTimeout(() => {
//     subscriber.next('Chenchu Lakshmi');
//    //  This will end the subscription
//     subscriber.complete();
//   }, 2000);
// });

// const observer = {
//   next: (value: string) => console.log(value),
//   complete: () => console.log('Subscription completed!'),
// };

// console.log('Before Subscribe');
// observable$.subscribe(observer);
// // OR
// // observable$.subscribe(
// //   (value: string) => console.log(value),
// //   null,
// //   () => console.log('Subscription completed!')
// // );
// console.log('After Subscribe');

// Sample 2: The Teardown logic
// When the Subscription ends, the Teardown logic is run, which allows the Observable to clean up after itself. And emitting the complete notification closes the Subscription.
// Where can we put this logic? Inside of the callback that we provide to our Observable.We can return a function and this function will be run during the Teardown phase of the Subscription.

// Output:
// Before Subscribe
// Observable Executed!
// Mahi Chenchith
// Mahathi
// After Subscribe
// Chenchu Lakshmi
// Subscription completed!
// Teardown

// We can see that after the Observable emitted the complete notification, which caused our Subscription to end, the Teardown logic was run. And the Teardown logic can be used by the Observable to clean up after itself to prevent memory leaks or to provide cancellation logic.
// For example. If we would have an Observable which would call the server using an HTTP request, we could abort that HTTP request in the Teardown logic.
// So if the user would unsubscribe before the request finishes, the HTTP call would be aborted.
// So the Teardown logic is the place to provide the behavior for the clean up and cancellation. This is an important advantage of the Observables. They provide a way to cancel ongoing processes that were initialized by the Observable.

// const observable$ = new Observable<string>((subscriber) => {
//   console.log('Observable Executed!');
//   subscriber.next('Mahi Chenchith');
//   subscriber.next('Mahathi');
//   setTimeout(() => {
//     subscriber.next('Chenchu Lakshmi');
//     subscriber.complete();
//   }, 2000);

//   // Teardown the logic goes in the function that we return from the function that has our observable logic
//   return () => {
//     console.log('Teardown');
//   };
// });

// const observer = {
//   next: (value: string) => console.log(value),
//   complete: () => console.log('Subscription completed!'),
// };

// console.log('Before Subscribe');
// observable$.subscribe(observer);
// console.log('After Subscribe');

// Example 5: Error Notification
// Output:
// Before Subscribe
// Observable Executed!
// Mahi Chenchith
// Mahathi
// After Subscribe
// Chenchu Lakshmi
// Failure
// Teardown
// const observable$ = new Observable<string>((subscriber) => {
//   console.log('Observable Executed!');
//   subscriber.next('Mahi Chenchith');
//   subscriber.next('Mahathi');
//   setTimeout(() => {
//     subscriber.next('Chenchu Lakshmi');
//   }, 2000);
//   setTimeout(() => {
//     subscriber.error(new Error('Failure'));
//   }, 4000);
//   // The teardown logic gets executed even in this case, it gets executed as soon as subscription is ended by any way.
//   return () => {
//     console.log('Teardown');
//   };
// });

// const observer = {
//   next: (value: string) => console.log(value),
//   error: (err) => console.log(err.message),
//   complete: () => console.log('Subscription completed!'),
// };

// console.log('Before Subscribe');
// observable$.subscribe(observer);
// console.log('After Subscribe');

// Example 6:
// Below is an example of the Observer object which has the handlers provided for every notification type - the next, error and complete notification.
// const observer = {
//   next: (item) => console.log(item),
//   error: (error) => console.log(error),
//   complete: () => console.log('Success'),
// };

// Let's now have a look at what would happen, if we would try to mix up the order a little bit and emit something after the Subscription ends.
// We can see that the value and complete notification emitted after the error didn't reach the Observer.
// And that's the expected behavior, as we have said in the previous section, the error notification ends the Subscription, which means there can be no more emissions after that.
// As a side note, notice that we call the next and complete methods on the subscriber and they are not passed to our Observer. This happens because this intermediate subscriber(function parameter of observable logic) object, created automatically by RxJS, checks whether the Subscription is still active before passing the notifications to the Observer.
// So this subscriber object works like a safety fuse and ensures that Observables and Subscriptions always work in a way that we designed, which means no notifications after Subscription ends.
// Concluding this example, we can also see that the Teardown logic was run immediately after emitting and handling the error notification.
// Output:
// Before Subscribe
// Observable Executed!
// Mahi Chenchith
// Mahathi
// After Subscribe
// Failure
// Teardown
const observable$ = new Observable<string>((subscriber) => {
  console.log('Observable Executed!');
  subscriber.next('Mahi Chenchith');
  subscriber.next('Mahathi');
  setTimeout(() => {
    subscriber.error(new Error('Failure'));
  }, 2000);
  setTimeout(() => {
    subscriber.next('Chenchu Lakshmi');
    subscriber.complete();
  }, 4000);
  return () => {
    console.log('Teardown');
  };
});

const observer = {
  next: (value: string) => console.log(value),
  error: (err) => console.log(err.message),
  complete: () => console.log('Subscription completed!'),
};

console.log('Before Subscribe');
observable$.subscribe(observer);
console.log('After Subscribe');

// Example 7: Cancellation - unsubscribe
// Final output:
// Emitted 1
// 1
// Emitted 2
// 2
// Emitted 3
// 3
// Unsubscribe

// const interval$ = new Observable<number>((subscriber) => {
//   let counter = 1;
//   const intervalId = setInterval(() => {
//     // The code inside the observable will still run even after unsubscribing as we didn't cleanup properly. This is where the teardown logic is used for.
//     console.log('Emitted', counter);
//     // subscriber.next(counter);
//     // counter++;
//     // or as shorthand
//     subscriber.next(counter++);
//   }, 2000);

//   // So let's implement the Teardown logic, in which we'll clear the interval, so we don't have any side effects or we don't have any code running like this after the Subscription ends.
//   // This time we could see that our Observable properly cleaned up after the Subscription ended. We don't have any memory leaks or any left over code running.
//   return () => {
//     clearInterval(intervalId);
//   };
// });

// const observer = {
//   next: (value) => console.log(value),
// };

// const subscription = interval$.subscribe(observer);

// setTimeout(() => {
//   console.log('Unsubscribe');
//   subscription.unsubscribe();
// }, 7000);
