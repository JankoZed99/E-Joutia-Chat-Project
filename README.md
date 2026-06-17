# e-Joutia Chat Project - Version 4

React Native / Expo prototype for **Project 5: Integrated Buyer-Seller Messaging**.

The app represents the messaging module of a Moroccan second-hand marketplace called **e-Joutia**. It focuses on the buyer-seller discussion flow, product context, unread messages, and price negotiation.

## Main Features

- Conversation list with realistic marketplace users
- Search by name, product, city, or last message
- Working tabs: **All chats**, **Unread**, and **Offers**
- Opening a conversation marks it as read
- `Unread` button inside chat to mark a conversation as unread again
- `+ Demo` button to simulate a new incoming message
- Product thumbnail, price, city, distance, and role badges
- Chat screen with buyer/seller bubbles
- Automatic reply simulation after sending a message
- Make Offer modal for buyer-side conversations
- Offer card with clear states: pending, accepted, rejected, countered
- Seller-side Accept / Reject buttons for incoming offers
- Smart Suggestion card as a small UX bonus

## How to Run

Install dependencies:

```bash
npm install
```

Run on web:

```bash
npx expo start --web
```

Then open:

```text
http://localhost:8081
```

Run with Expo Go if the installed Expo Go version supports the SDK:

```bash
npx expo start
```

## Demo Flow

1. Start on the conversation list.
2. Press **Unread** tab to view unread conversations.
3. Open an unread chat. The unread badge disappears.
4. Go back to the conversation list.
5. Press **+ Demo** to simulate an incoming message.
6. Open a buyer-side conversation and press **Make Offer**.
7. Send an offer and wait for the automatic seller reply.
8. Open a seller-side conversation with a pending offer and test **Accept** / **Reject**.
9. Press **Unread** inside a chat to manually mark it unread for testing.

## Technical Notes

This version intentionally avoids Firebase, Socket.io, and React Navigation to keep the project easy to run before submission. It uses local state to simulate real-time chat behavior, which is acceptable for a UI/UX prototype.

