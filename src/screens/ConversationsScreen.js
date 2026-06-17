import React, { useMemo, useState } from 'react';
import { FlatList, View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import ConversationItem from '../components/ConversationItem';

const tabs = [
  { key: 'all', label: 'All chats' },
  { key: 'unread', label: 'Unread' },
  { key: 'offers', label: 'Offers' },
];

export default function ConversationsScreen({ conversations, onOpenChat, onSimulateIncoming }) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const counts = useMemo(() => ({
    all: conversations.length,
    unread: conversations.filter((item) => item.unread > 0).length,
    offers: conversations.filter((item) => item.hasOffer).length,
    online: conversations.filter((item) => item.online).length,
  }), [conversations]);

  const filteredConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return conversations.filter((item) => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'unread' && item.unread > 0) ||
        (activeTab === 'offers' && item.hasOffer);

      const searchableText = `${item.userName} ${item.productTitle} ${item.city} ${item.lastMessage}`.toLowerCase();
      const matchesSearch = !normalizedQuery || searchableText.includes(normalizedQuery);

      return matchesTab && matchesSearch;
    });
  }, [conversations, query, activeTab]);

  const unreadCount = conversations.reduce((total, item) => total + (item.unread || 0), 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>e-Joutia Marketplace</Text>
          <Text style={styles.title}>Messages</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{unreadCount}</Text>
        </View>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>Buyer ↔ Seller Chat</Text>
            <Text style={styles.heroText}>
              Opening a chat marks it as read. Use the demo button to test new unread messages.
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.86} style={styles.demoButton} onPress={onSimulateIncoming}>
            <Text style={styles.demoButtonText}>+ Demo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statNumber}>{counts.unread}</Text>
            <Text style={styles.statLabel}>Unread chats</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statNumber}>{counts.offers}</Text>
            <Text style={styles.statLabel}>Offers</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statNumber}>{counts.online}</Text>
            <Text style={styles.statLabel}>Online</Text>
          </View>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by buyer, product, city or message"
          placeholderTextColor="#9AA197"
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
            <Text style={styles.clearText}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.85}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
              <View style={[styles.tabCounter, isActive && styles.activeTabCounter]}>
                <Text style={[styles.tabCounterText, isActive && styles.activeTabCounterText]}>{counts[tab.key]}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationItem item={item} onPress={() => onOpenChat(item)} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🕵️</Text>
            <Text style={styles.emptyTitle}>No conversations found</Text>
            <Text style={styles.emptyText}>Try another tab, name, product, city, or press + Demo.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F2',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: '#15A362',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 2,
    fontSize: 34,
    lineHeight: 38,
    color: '#152016',
    fontWeight: '900',
  },
  headerBadge: {
    minWidth: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#152016',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },
  heroCard: {
    marginHorizontal: 14,
    marginTop: 8,
    padding: 16,
    borderRadius: 24,
    backgroundColor: '#DDFBEA',
    borderWidth: 1,
    borderColor: '#B5EFD0',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroCopy: {
    flex: 1,
  },
  heroTitle: {
    color: '#16351F',
    fontSize: 17,
    fontWeight: '900',
  },
  heroText: {
    color: '#46624F',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  demoButton: {
    marginLeft: 12,
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 21,
    backgroundColor: '#152016',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  statPill: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(21,163,98,0.16)',
  },
  statNumber: {
    color: '#152016',
    fontSize: 17,
    fontWeight: '900',
  },
  statLabel: {
    marginTop: 2,
    color: '#55705D',
    fontSize: 11,
    fontWeight: '800',
  },
  searchBox: {
    marginHorizontal: 14,
    marginTop: 14,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E4E8DF',
  },
  searchIcon: {
    fontSize: 17,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#172116',
    fontSize: 14,
    outlineStyle: 'none',
  },
  clearButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EEF1EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    fontSize: 22,
    color: '#596158',
    marginTop: -2,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E4E8DF',
  },
  activeTab: {
    backgroundColor: '#152016',
    borderColor: '#152016',
  },
  tabText: {
    color: '#667060',
    fontWeight: '800',
    fontSize: 13,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabCounter: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EEF1EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7,
    paddingHorizontal: 5,
  },
  activeTabCounter: {
    backgroundColor: '#15A362',
  },
  tabCounterText: {
    color: '#667060',
    fontSize: 11,
    fontWeight: '900',
  },
  activeTabCounterText: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 30,
  },
  emptyEmoji: {
    fontSize: 36,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '900',
    color: '#172116',
  },
  emptyText: {
    marginTop: 5,
    color: '#6D7569',
    textAlign: 'center',
  },
});
