import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import OfferCard from '../components/OfferCard';
import { smartSuggestions } from '../data/mockData';

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function firstName(fullName) {
  return String(fullName || '').split(' ')[0] || 'seller';
}

function cleanSuggestionText(suggestion) {
  return suggestion
    .replace('Suggested reply: “', '')
    .replace('Suggested reply: "', '')
    .replace('”', '')
    .replace('"', '');
}

function buildAutoReply(messageText, currentUserRole, conversation) {
  const message = String(messageText || '').toLowerCase();
  const otherName = firstName(conversation.userName);

  if (message.includes('available') || message.includes('still')) {
    return currentUserRole === 'buyer'
      ? `Yes, it is still available. I can reserve it for you if you are serious.`
      : `Yes, I am still interested. Can we discuss the price?`;
  }

  if (message.includes('meet') || message.includes('pickup') || message.includes('location')) {
    return currentUserRole === 'buyer'
      ? `We can meet near the city center. A public place is better.`
      : `That works for me. Send me the meeting point please.`;
  }

  if (message.includes('price') || message.includes('dh') || message.includes('offer')) {
    return currentUserRole === 'buyer'
      ? `The price is a little negotiable. Send me your best offer.`
      : `I can make an offer if the product is in good condition.`;
  }

  return currentUserRole === 'buyer'
    ? `Thanks. ${otherName} will reply soon with more details.`
    : `Okay, thank you. I will check and reply shortly.`;
}

export default function ChatScreen({
  conversation,
  messages,
  onUpdateMessages,
  onUpdateConversation,
  onMarkUnread,
  onBack,
}) {
  const currentUserRole = conversation.role === 'Buyer' ? 'seller' : 'buyer';
  const isBuyingFromThisPerson = currentUserRole === 'buyer';
  const [text, setText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');

  const roleExplanation = isBuyingFromThisPerson
    ? `You are the buyer. ${firstName(conversation.userName)} is selling this item. You can send an offer, then the seller replies.`
    : `You are the seller. ${firstName(conversation.userName)} is a buyer interested in your item. You can accept or reject incoming offers.`;

  const suggestion = useMemo(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.type === 'offer' && currentUserRole === 'seller') return smartSuggestions.sellerOffer;
    if (lastMessage?.type === 'offer') return smartSuggestions.offer;
    if (String(lastMessage?.text || '').toLowerCase().includes('meet')) return smartSuggestions.pickup;
    return currentUserRole === 'seller' ? smartSuggestions.sellerDefault : smartSuggestions.default;
  }, [messages, currentUserRole]);

  const addAutoReplyAfterMessage = (messageText) => {
    setTimeout(() => {
      const time = getCurrentTime();
      const otherSender = currentUserRole === 'buyer' ? 'seller' : 'buyer';
      const replyText = buildAutoReply(messageText, currentUserRole, conversation);

      onUpdateMessages(conversation.id, (currentMessages) => [
        ...currentMessages,
        {
          id: `auto-${Date.now()}`,
          text: replyText,
          sender: otherSender,
          time,
          automated: true,
        },
      ]);

      onUpdateConversation(conversation.id, {
        lastMessage: replyText,
        time,
        unread: 0,
        isNew: false,
      });
    }, 850);
  };

  const addSystemSellerResponse = (offerId, numericAmount) => {
    setTimeout(() => {
      const time = getCurrentTime();
      const price = Number(conversation.productPrice || 0);
      const accepted = price > 0 && Number(numericAmount) >= Math.round(price * 0.85);
      const status = accepted ? 'accepted' : 'countered';
      const replyText = accepted
        ? `Okay, I accept your offer of ${numericAmount} DH. We can arrange the meeting.`
        : `Thanks for the offer. I cannot accept ${numericAmount} DH, but we can negotiate a little.`;

      onUpdateMessages(conversation.id, (currentMessages) =>
        currentMessages.map((message) => (
          message.id === offerId ? { ...message, status } : message
        )).concat({
          id: `auto-offer-${Date.now()}`,
          text: replyText,
          sender: 'seller',
          time,
          automated: true,
        })
      );

      onUpdateConversation(conversation.id, {
        lastMessage: status === 'accepted' ? `Offer accepted: ${numericAmount} DH` : `Seller countered ${numericAmount} DH`,
        time,
        hasOffer: true,
        unread: 0,
        isNew: false,
      });
    }, 950);
  };

  const sendMessage = () => {
    const cleanText = text.trim();
    if (!cleanText) return;

    const time = getCurrentTime();
    const newMessage = {
      id: `m-${Date.now()}`,
      text: cleanText,
      sender: currentUserRole,
      time,
      read: true,
    };

    onUpdateMessages(conversation.id, (currentMessages) => [...currentMessages, newMessage]);
    onUpdateConversation(conversation.id, {
      lastMessage: cleanText,
      time,
      unread: 0,
      isNew: false,
    });
    setText('');
    addAutoReplyAfterMessage(cleanText);
  };

  const useSuggestion = () => {
    setText(cleanSuggestionText(suggestion));
  };

  const sendOffer = () => {
    const cleanAmount = offerAmount.trim();
    if (!cleanAmount || !isBuyingFromThisPerson) return;

    const numericAmount = cleanAmount.replace(/[^0-9]/g, '');
    if (!numericAmount) return;

    const time = getCurrentTime();
    const offerId = `offer-${Date.now()}`;
    const newOffer = {
      id: offerId,
      type: 'offer',
      amount: numericAmount,
      status: 'pending',
      sender: 'buyer',
      time,
      read: true,
    };

    onUpdateMessages(conversation.id, (currentMessages) => [...currentMessages, newOffer]);
    onUpdateConversation(conversation.id, {
      lastMessage: `You offered ${numericAmount} DH`,
      time,
      hasOffer: true,
      unread: 0,
      isNew: false,
    });
    setOfferAmount('');
    setModalVisible(false);
    addSystemSellerResponse(offerId, numericAmount);
  };

  const updateOfferStatus = (id, status) => {
    const time = getCurrentTime();
    const responseText = status === 'accepted'
      ? 'I accept your offer. We can arrange the meeting details.'
      : 'Sorry, I cannot accept this price. We can negotiate another amount.';

    onUpdateMessages(conversation.id, (currentMessages) =>
      currentMessages.map((message) => (
        message.id === id ? { ...message, status } : message
      )).concat({
        id: `response-${Date.now()}`,
        text: responseText,
        sender: currentUserRole,
        time,
        read: true,
      })
    );

    onUpdateConversation(conversation.id, {
      lastMessage: status === 'accepted' ? 'You accepted the buyer offer' : 'You rejected the buyer offer',
      time,
      hasOffer: true,
      unread: 0,
      isNew: false,
    });
  };

  const openOfferModal = () => {
    if (isBuyingFromThisPerson) setModalVisible(true);
  };

  const markUnreadAndGoBack = () => {
    onMarkUnread(conversation.id);
    onBack();
  };

  const renderMessage = ({ item }) => {
    const isMine = item.sender === currentUserRole;
    const canRespondToOffer = currentUserRole === 'seller' && item.type === 'offer' && item.sender === 'buyer' && item.status === 'pending';

    if (item.type === 'offer') {
      return (
        <View style={[styles.messageRow, isMine ? styles.alignRight : styles.alignLeft]}>
          <OfferCard
            amount={item.amount}
            status={item.status}
            isMine={isMine}
            canRespond={canRespondToOffer}
            onAccept={() => updateOfferStatus(item.id, 'accepted')}
            onReject={() => updateOfferStatus(item.id, 'rejected')}
          />
          <Text style={[styles.messageTime, isMine && styles.messageTimeRight]}>{item.time}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.messageRow, isMine ? styles.alignRight : styles.alignLeft]}>
        <View style={[styles.bubble, isMine ? styles.myBubble : styles.otherBubble]}>
          {item.automated && <Text style={styles.autoLabel}>Auto reply simulation</Text>}
          <Text style={[styles.messageText, isMine ? styles.myText : styles.otherText]}>{item.text}</Text>
          {isMine && (
            <View style={styles.readReceiptRow}>
              <Text style={styles.readReceiptText}>✓✓ Read</Text>
            </View>
          )}
        </View>
        <Text style={[styles.messageTime, isMine && styles.messageTimeRight]}>{item.time}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.avatarWrap}>
          <Image source={{ uri: conversation.avatar }} style={styles.avatar} />
          {conversation.online && <View style={styles.onlineDot} />}
        </View>

        <View style={styles.headerInfo}>
          <Text numberOfLines={1} style={styles.userName}>{conversation.userName}</Text>
          <Text style={styles.userStatus}>{conversation.online ? 'Online now' : `Usually replies from ${conversation.city}`}</Text>
        </View>

        <TouchableOpacity activeOpacity={0.85} style={styles.unreadButton} onPress={markUnreadAndGoBack}>
          <Text style={styles.unreadButtonText}>Unread</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.productCard}>
        <Image source={{ uri: conversation.productImage }} style={styles.productImage} />
        <View style={styles.productContent}>
          <Text numberOfLines={1} style={styles.productTitle}>{conversation.productTitle}</Text>
          <Text style={styles.productMeta}>{conversation.productPrice} DH • {conversation.distance} from you</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.offerButton, !isBuyingFromThisPerson && styles.offerButtonDisabled]}
          onPress={openOfferModal}
        >
          <Text style={[styles.offerButtonText, !isBuyingFromThisPerson && styles.offerButtonDisabledText]}>
            {isBuyingFromThisPerson ? 'Make Offer' : 'Seller mode'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.roleNotice}>
        <Text style={styles.roleNoticeText}>{roleExplanation}</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
      />

      <TouchableOpacity activeOpacity={0.85} style={styles.suggestionCard} onPress={useSuggestion}>
        <View style={styles.suggestionIcon}>
          <Text style={styles.suggestionIconText}>✨</Text>
        </View>
        <View style={styles.suggestionTextWrap}>
          <Text style={styles.suggestionTitle}>Smart Suggestion</Text>
          <Text numberOfLines={2} style={styles.suggestionText}>{suggestion}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.inputBar}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.plusButton, !isBuyingFromThisPerson && styles.plusButtonDisabled]}
          onPress={openOfferModal}
        >
          <Text style={[styles.plusText, !isBuyingFromThisPerson && styles.plusTextDisabled]}>+</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#98A096"
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity activeOpacity={0.85} style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalEyebrow}>Negotiation</Text>
            <Text style={styles.modalTitle}>Make an offer</Text>
            <Text style={styles.modalDescription}>
              Send a price proposal to {firstName(conversation.userName)}. The seller will answer automatically in this prototype.
            </Text>

            <View style={styles.offerInputWrap}>
              <TextInput
                style={styles.offerInput}
                placeholder="Example: 450"
                placeholderTextColor="#9AA197"
                keyboardType="numeric"
                value={offerAmount}
                onChangeText={setOfferAmount}
              />
              <Text style={styles.currency}>DH</Text>
            </View>

            <TouchableOpacity activeOpacity={0.9} style={styles.sendOfferButton} onPress={sendOffer}>
              <Text style={styles.sendOfferText}>Send Offer</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F2',
  },
  header: {
    minHeight: 76,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7F2',
    borderBottomWidth: 1,
    borderBottomColor: '#E5EADF',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  backText: {
    fontSize: 34,
    lineHeight: 34,
    color: '#172116',
    fontWeight: '500',
    marginTop: -2,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    marginRight: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E9ECE6',
  },
  onlineDot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    right: 0,
    bottom: 1,
    borderWidth: 3,
    borderColor: '#F6F7F2',
    backgroundColor: '#22C55E',
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    color: '#152016',
    fontSize: 16,
    fontWeight: '900',
  },
  userStatus: {
    marginTop: 2,
    color: '#667060',
    fontSize: 12,
    fontWeight: '600',
  },
  unreadButton: {
    height: 38,
    paddingHorizontal: 13,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE4D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadButtonText: {
    color: '#152016',
    fontSize: 12,
    fontWeight: '900',
  },
  productCard: {
    marginHorizontal: 14,
    marginTop: 12,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4E8DF',
  },
  productImage: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#E9ECE6',
  },
  productContent: {
    flex: 1,
    marginLeft: 12,
    minWidth: 0,
  },
  productTitle: {
    color: '#172116',
    fontSize: 14,
    fontWeight: '900',
  },
  productMeta: {
    marginTop: 4,
    color: '#15A362',
    fontSize: 12,
    fontWeight: '800',
  },
  offerButton: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 19,
    backgroundColor: '#152016',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  offerButtonDisabled: {
    backgroundColor: '#E8ECE4',
  },
  offerButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
  offerButtonDisabledText: {
    color: '#667060',
  },
  roleNotice: {
    marginHorizontal: 14,
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: '#EEF6FF',
    borderWidth: 1,
    borderColor: '#D7E9FF',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  roleNoticeText: {
    color: '#29415D',
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '700',
  },
  messagesContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
  },
  messageRow: {
    marginBottom: 12,
    maxWidth: '86%',
  },
  alignRight: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  alignLeft: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 21,
  },
  myBubble: {
    backgroundColor: '#152016',
    borderBottomRightRadius: 6,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#E4E8DF',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  myText: {
    color: '#FFFFFF',
  },
  otherText: {
    color: '#18231A',
  },
  autoLabel: {
    color: '#15A362',
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 3,
  },
  readReceiptRow: {
    marginTop: 5,
    alignItems: 'flex-end',
  },
  readReceiptText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 10.5,
    fontWeight: '800',
  },
  messageTime: {
    marginTop: 4,
    color: '#9AA197',
    fontSize: 11,
    fontWeight: '700',
  },
  messageTimeRight: {
    marginRight: 4,
  },
  suggestionCard: {
    marginHorizontal: 14,
    marginBottom: 8,
    borderRadius: 18,
    padding: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#D7E9FF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  suggestionIconText: {
    fontSize: 18,
  },
  suggestionTextWrap: {
    flex: 1,
  },
  suggestionTitle: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '900',
  },
  suggestionText: {
    marginTop: 2,
    color: '#29415D',
    fontSize: 12,
    lineHeight: 17,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#E4E8DF',
  },
  plusButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E9FBEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  plusButtonDisabled: {
    backgroundColor: '#EEF1EA',
  },
  plusText: {
    color: '#15A362',
    fontSize: 26,
    lineHeight: 28,
    fontWeight: '700',
  },
  plusTextDisabled: {
    color: '#A7B0A3',
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 96,
    borderRadius: 21,
    paddingHorizontal: 14,
    paddingTop: 11,
    paddingBottom: 10,
    backgroundColor: '#F1F3EE',
    color: '#172116',
    fontSize: 14,
    fontWeight: '600',
    outlineStyle: 'none',
  },
  sendButton: {
    minWidth: 64,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#15A362',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    paddingHorizontal: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#BFC8BC',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(21, 32, 22, 0.48)',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 8,
  },
  modalEyebrow: {
    color: '#15A362',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: 12,
    fontWeight: '900',
  },
  modalTitle: {
    marginTop: 4,
    color: '#152016',
    fontSize: 26,
    lineHeight: 31,
    fontWeight: '900',
  },
  modalDescription: {
    marginTop: 8,
    color: '#667060',
    fontSize: 14,
    lineHeight: 20,
  },
  offerInputWrap: {
    marginTop: 18,
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D7DED2',
    backgroundColor: '#F8FAF6',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerInput: {
    flex: 1,
    color: '#172116',
    fontSize: 22,
    fontWeight: '900',
    outlineStyle: 'none',
  },
  currency: {
    color: '#15A362',
    fontWeight: '900',
    fontSize: 16,
  },
  sendOfferButton: {
    marginTop: 14,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#152016',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendOfferText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
  },
  cancelButton: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  cancelText: {
    color: '#667060',
    fontSize: 14,
    fontWeight: '800',
  },
});
