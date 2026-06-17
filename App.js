import React, { useMemo, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import ConversationsScreen from './src/screens/ConversationsScreen';
import ChatScreen from './src/screens/ChatScreen';
import { conversations, initialMessages } from './src/data/mockData';

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getOtherSideSender(conversation) {
  return conversation.role === 'Seller' ? 'seller' : 'buyer';
}

export default function App() {
  const [conversationList, setConversationList] = useState(conversations);
  const [messagesByConversation, setMessagesByConversation] = useState(initialMessages);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const selectedConversation = useMemo(
    () => conversationList.find((item) => item.id === selectedConversationId) || null,
    [conversationList, selectedConversationId]
  );

  const openChat = (conversation) => {
    setSelectedConversationId(conversation.id);

    // Opening a conversation marks it as read, just like WhatsApp/Messenger.
    setConversationList((currentList) =>
      currentList.map((item) => (
        item.id === conversation.id ? { ...item, unread: 0, isNew: false } : item
      ))
    );
  };

  const closeChat = () => {
    setSelectedConversationId(null);
  };

  const updateMessages = (conversationId, updater) => {
    setMessagesByConversation((currentMessages) => {
      const previousMessages = currentMessages[conversationId] || [];
      const nextMessages = typeof updater === 'function' ? updater(previousMessages) : updater;

      return {
        ...currentMessages,
        [conversationId]: nextMessages,
      };
    });
  };

  const updateConversation = (conversationId, patch) => {
    setConversationList((currentList) =>
      currentList.map((item) => (
        item.id === conversationId ? { ...item, ...patch } : item
      ))
    );
  };

  const markConversationUnread = (conversationId) => {
    setConversationList((currentList) =>
      currentList.map((item) => (
        item.id === conversationId
          ? { ...item, unread: Math.max(item.unread || 0, 1), isNew: true }
          : item
      ))
    );
  };

  const simulateIncomingMessage = () => {
    const time = getCurrentTime();
    const target = conversationList.find((item) => item.online) || conversationList[0];
    if (!target) return;

    const demoMessages = [
      'Salam, I just replied. Is the item still available?',
      'Can we meet today near the city center?',
      'I checked the photos. Can you lower the price a little?',
      'I am interested. Please send me the exact location.',
      'Deal sounds good. When are you free?',
    ];
    const messageText = demoMessages[Math.floor(Math.random() * demoMessages.length)];

    updateMessages(target.id, (currentMessages) => [
      ...currentMessages,
      {
        id: `incoming-${Date.now()}`,
        text: messageText,
        sender: getOtherSideSender(target),
        time,
        automated: true,
      },
    ]);

    setConversationList((currentList) =>
      currentList.map((item) => (
        item.id === target.id
          ? {
              ...item,
              unread: (item.unread || 0) + 1,
              isNew: true,
              lastMessage: messageText,
              time,
            }
          : item
      ))
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F7F2" />
      <View style={styles.appShell}>
        {selectedConversation ? (
          <ChatScreen
            conversation={selectedConversation}
            messages={messagesByConversation[selectedConversation.id] || []}
            onUpdateMessages={updateMessages}
            onUpdateConversation={updateConversation}
            onMarkUnread={markConversationUnread}
            onBack={closeChat}
          />
        ) : (
          <ConversationsScreen
            conversations={conversationList}
            onOpenChat={openChat}
            onSimulateIncoming={simulateIncomingMessage}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F7F2',
  },
  appShell: {
    flex: 1,
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    backgroundColor: '#F6F7F2',
  },
});
