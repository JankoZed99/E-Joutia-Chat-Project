# Project Notes

## Project 5: Integrated Messaging System

The objective is to build a buyer-seller chat module for a second-hand marketplace application. The implementation covers the required screens and interactions:

- List of active conversations
- Chat window with buyer and seller messages
- Negotiation module with Make Offer
- Offer card with Accept / Reject actions
- Smooth prototype of real-time behavior using local state

## Important UX Decisions

### Read / Unread behavior

When the user opens a conversation, the conversation is marked as read and the unread counter disappears. This simulates the behavior of popular messaging apps such as WhatsApp or Messenger.

A **Mark Unread** button was added inside the chat to allow testing the unread state again without restarting the app.

### Automatic replies

Automatic replies are included only as a prototype simulation. They show how real-time buyer-seller messages would appear if a backend such as Firebase Firestore or Socket.io were connected.

### Offer logic

- If the current user is the buyer, they can send an offer.
- The seller replies automatically in the prototype.
- If the current user is the seller, they can accept or reject incoming pending offers.

This makes the negotiation flow clearer and avoids the confusion of a buyer accepting their own offer.

## Suggested Future Improvements

- Connect messages to Firebase Firestore for real-time updates
- Add user authentication
- Add image sharing inside chat
- Add push notifications
- Store read/unread state in AsyncStorage or backend database
- Add product availability status after an offer is accepted
