import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const statusConfig = {
  pending: { label: 'Waiting for seller response', color: '#B7791F', background: '#FFF8E5' },
  incoming: { label: 'Buyer is waiting for your decision', color: '#B7791F', background: '#FFF8E5' },
  accepted: { label: 'Offer accepted by seller', color: '#15803D', background: '#E9FBEF' },
  rejected: { label: 'Offer rejected by seller', color: '#B42318', background: '#FFF0F0' },
  countered: { label: 'Seller asked for a better price', color: '#9A3412', background: '#FFF7ED' },
};

export default function OfferCard({
  amount,
  status = 'pending',
  canRespond = false,
  onAccept,
  onReject,
  isMine = false,
}) {
  const config = statusConfig[canRespond && status === 'pending' ? 'incoming' : status] || statusConfig.pending;
  const title = canRespond ? 'Incoming Buyer Offer' : isMine ? 'Your Price Offer' : 'Price Offer';

  return (
    <View style={[styles.card, { backgroundColor: config.background }]}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>💰</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.status, { color: config.color }]}>{config.label}</Text>
        </View>
      </View>

      <Text style={styles.amount}>{amount} DH</Text>
      <Text style={styles.caption}>
        {canRespond
          ? 'You are viewing the seller side, so you can accept or reject this offer.'
          : 'The seller must respond before the deal can be confirmed.'}
      </Text>

      {canRespond && status === 'pending' && (
        <View style={styles.buttonsRow}>
          <TouchableOpacity activeOpacity={0.85} style={[styles.button, styles.reject]} onPress={onReject}>
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={[styles.button, styles.accept]} onPress={onAccept}>
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 290,
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  icon: {
    fontSize: 18,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: '#172116',
    fontWeight: '900',
    fontSize: 15,
  },
  status: {
    marginTop: 2,
    fontWeight: '800',
    fontSize: 12,
  },
  amount: {
    marginTop: 12,
    color: '#172116',
    fontSize: 30,
    fontWeight: '900',
  },
  caption: {
    marginTop: 5,
    color: '#586257',
    fontSize: 12.5,
    lineHeight: 18,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  button: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reject: {
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F2B8B5',
  },
  accept: {
    marginLeft: 8,
    backgroundColor: '#15A362',
  },
  rejectText: {
    color: '#B42318',
    fontWeight: '900',
  },
  acceptText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
});
