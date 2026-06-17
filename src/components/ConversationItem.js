import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function ConversationItem({ item, onPress }) {
  const isUnread = item.unread > 0;

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      style={[styles.card, isUnread && styles.unreadCard]}
      onPress={onPress}
    >
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.online && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.nameRow}>
            <Text numberOfLines={1} style={[styles.name, isUnread && styles.unreadName]}>{item.userName}</Text>
            {item.verified && <Text style={styles.verified}>✓</Text>}
            {item.isNew && <Text style={styles.newLabel}>NEW</Text>}
          </View>
          <Text style={[styles.time, isUnread && styles.timeUnread]}>{item.time}</Text>
        </View>

        <View style={styles.productRow}>
          <Text numberOfLines={1} style={styles.productTitle}>{item.productTitle}</Text>
          <Text style={styles.price}>{item.productPrice} DH</Text>
        </View>

        <View style={styles.bottomRow}>
          <Text numberOfLines={1} style={[styles.lastMessage, isUnread && styles.unreadMessage]}>
            {item.lastMessage}
          </Text>
          {isUnread && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unread}</Text>
            </View>
          )}
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>{item.city} • {item.distance}</Text>
          {item.hasOffer && <Text style={styles.offerTag}>Offer</Text>}
          <Text style={styles.roleTag}>{item.role === 'Seller' ? 'Buying' : 'Selling'}</Text>
        </View>
      </View>

      <Image source={{ uri: item.productImage }} style={styles.productImage} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 12,
    marginHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  unreadCard: {
    borderColor: '#15A362',
    backgroundColor: '#FBFFFC',
  },
  avatarWrapper: {
    width: 58,
    height: 58,
    marginRight: 12,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E9ECE6',
  },
  onlineDot: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    right: 1,
    bottom: 2,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  name: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#152016',
  },
  unreadName: {
    fontWeight: '900',
  },
  verified: {
    marginLeft: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0EA5E9',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 18,
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
  },
  newLabel: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#DCFCE7',
    color: '#15803D',
    fontSize: 9.5,
    fontWeight: '900',
  },
  time: {
    marginLeft: 8,
    fontSize: 12,
    color: '#8A9387',
    fontWeight: '600',
  },
  timeUnread: {
    color: '#15A362',
    fontWeight: '900',
  },
  productRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productTitle: {
    flex: 1,
    color: '#343D35',
    fontSize: 13,
    fontWeight: '700',
  },
  price: {
    marginLeft: 8,
    color: '#15A362',
    fontWeight: '900',
    fontSize: 12,
  },
  bottomRow: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    color: '#6B756A',
    fontSize: 13,
  },
  unreadMessage: {
    color: '#172116',
    fontWeight: '900',
  },
  badge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    backgroundColor: '#15A362',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
  metaRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  meta: {
    flexShrink: 1,
    color: '#9AA197',
    fontSize: 11.5,
    fontWeight: '600',
  },
  offerTag: {
    marginLeft: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#FFF7ED',
    color: '#9A3412',
    fontSize: 10,
    fontWeight: '900',
  },
  roleTag: {
    marginLeft: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#EEF6FF',
    color: '#1D4ED8',
    fontSize: 10,
    fontWeight: '900',
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: 16,
    marginLeft: 12,
    backgroundColor: '#E9ECE6',
  },
});
