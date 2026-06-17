# E-Joutia Chat Project

React Native / Expo prototype for **Project 5: Integrated Buyer-Seller Messaging**.

This project represents the messaging module of **e-Joutia**, a Moroccan second-hand marketplace application. The goal is to provide a simple and interactive communication space between buyers and sellers, with support for product context, unread messages, and price negotiation.

## Project Objective

The main objective of this module is to create a buyer-seller chat system for a second-hand marketplace. Users can view their active conversations, open a discussion related to a specific product, exchange messages, and negotiate prices through an offer system inspired by marketplace applications such as Wallapop.

## Main Features

* Active conversation list
* Interlocutor name and avatar display
* Product thumbnail displayed in each conversation
* Last message preview with timestamp
* Search by user name, product, city, or message content
* Conversation filters: **All chats**, **Unread**, and **Offers**
* Opening a conversation automatically marks it as read
* Manual unread option for testing the unread state
* Demo button to simulate a new incoming message
* Chat screen with buyer and seller message bubbles
* Buyer messages displayed on the right
* Seller messages displayed on the left
* Message timestamps
* Product information shown inside the chat
* **Make Offer** button for buyer-side conversations
* Offer modal allowing the buyer to propose a price
* Offer card displayed directly inside the chat
* Seller-side **Accept** and **Reject** buttons for incoming offers
* Offer status management: pending, accepted, rejected, and countered
* Automatic reply simulation to make the chat feel interactive
* Smart suggestion card as a small UX improvement

## Technologies Used

* React Native
* Expo
* JavaScript
* React Hooks
* Local state management

## How to Run the Project

Install the dependencies:

```bash
npm install
```

Run the project on web:

```bash
npx expo start --web
```

Then open the following address in the browser:

```text
http://localhost:8081
```

To run the project using Expo Go:

```bash
npx expo start
```

Then scan the QR code with the Expo Go application, if the installed Expo Go version supports the project SDK.

## Demo Flow

1. Start from the conversation list.
2. Use the **All chats**, **Unread**, and **Offers** tabs to filter conversations.
3. Open an unread conversation and notice that the unread badge disappears.
4. Return to the conversation list.
5. Press **+ Demo** to simulate a new incoming message.
6. Open a buyer-side conversation.
7. Press **Make Offer** and submit a proposed price.
8. Wait for the automatic seller reply.
9. Open a seller-side conversation with a pending offer.
10. Test the **Accept** and **Reject** buttons.
11. Use the **Unread** button inside a chat to manually mark a conversation as unread for testing.

## Technical Notes

This project is implemented as a UI/UX prototype. Instead of using an external backend such as Firebase Firestore or a WebSocket server, it uses local React state to simulate real-time chat behavior.

This approach keeps the project simple to run and allows the main functional requirements to be demonstrated clearly: active discussions, buyer-seller messages, unread states, automatic replies, and offer negotiation.

## Folder Structure

```text
e-joutia-chat-project/
│
├── App.js
├── app.json
├── package.json
├── README.md
│
└── src/
    ├── components/
    │   ├── ConversationItem.js
    │   └── OfferCard.js
    │
    ├── data/
    │   └── mockData.js
    │
    └── screens/
        ├── ChatScreen.js
        └── ConversationsScreen.js
```
## Authors

- Ayoub Hmamouchi
- Loubna Kerouad

**Licence IDAI**
