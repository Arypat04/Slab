import React, { useState } from 'react';
import {
  View, Text, Pressable, FlatList, StyleSheet, SafeAreaView, Alert, TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../src/theme';
import { useAppStore } from '../../src/store/useAppStore';
import type { CardItem } from '../../src/types';

type Filter = 'all' | 'raw' | 'graded' | 'pokemon' | 'sports';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'graded', label: 'Graded' },
  { key: 'raw', label: 'Raw' },
  { key: 'pokemon', label: 'Pokémon' },
  { key: 'sports', label: 'Sports' },
];

function CardGridItem({ card, onDelete }: { card: CardItem; onDelete: () => void }) {
  const t = useTheme();
  const isPos = card.value - (card.purchasePrice ?? 0) >= 0;
  const gainPct = card.purchasePrice
    ? (((card.value - card.purchasePrice) / card.purchasePrice) * 100).toFixed(0)
    : null;

  const confirmDelete = () => {
    Alert.alert(
      'Remove Card',
      `Remove "${card.name}" from your collection?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: onDelete },
      ],
    );
  };

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/detail', params: { id: card.id } })}
      onLongPress={confirmDelete}
      delayLongPress={400}
      style={[styles.gridItem, { backgroundColor: t.surface, borderColor: t.line }]}
    >
      {/* Card thumbnail */}
      <View style={[styles.thumb, { backgroundColor: t.surface2, borderColor: t.line2 }]}>
        {card.isRaw ? (
          <View style={[styles.rawBadge, { backgroundColor: t.ink }]}>
            <Text style={[styles.rawBadgeText, { color: t.bg }]}>RAW</Text>
          </View>
        ) : (
          <View style={styles.gradeOverlay}>
            <Text style={[styles.gradeNum, { color: t.accent }]}>{card.grade.replace('PSA ', '')}</Text>
            <View style={[styles.gradeLabelWrap, { backgroundColor: '#0d1b17' }]}>
              <Text style={styles.gradeLabel}>PSA</Text>
            </View>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.cardName, { color: t.ink }]} numberOfLines={1}>{card.name}</Text>
        <Text style={[styles.cardMeta, { color: t.muted }]} numberOfLines={1}>
          {card.set ?? card.game}
        </Text>
        <View style={styles.priceRow}>
          <Text style={[styles.value, { color: t.ink }]}>${card.value}</Text>
          {gainPct && (
            <Text style={[styles.delta, { color: isPos ? t.pos : t.neg }]}>
              {isPos ? '+' : ''}{gainPct}%
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default function Collection() {
  const t = useTheme();
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const collection = useAppStore((s) => s.collection);

  const removeCard = useAppStore((s) => s.removeCard);
  const totalValue = collection.reduce((s, c) => s + c.value, 0);

  const filtered = collection.filter((c) => {
    if (search.trim()) {
      const s = search.toLowerCase();
      if (!c.name.toLowerCase().includes(s) && !(c.set ?? '').toLowerCase().includes(s)) return false;
    }
    if (filter === 'all') return true;
    if (filter === 'raw') return c.isRaw;
    if (filter === 'graded') return !c.isRaw;
    if (filter === 'pokemon') return c.game?.toLowerCase().includes('pokemon') || c.game?.toLowerCase().includes('pokémon');
    if (filter === 'sports') {
      const g = c.game?.toLowerCase() ?? '';
      return g.includes('sport') || g.includes('nhl') || g.includes('nba') || g.includes('nfl') || g.includes('mlb') || g.includes('hockey') || g.includes('baseball') || g.includes('basketball') || g.includes('football') || g.includes('soccer');
    }
    return true;
  });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.titleText, { color: t.ink }]}>Collection</Text>
        <View style={[styles.countBadge, { backgroundColor: t.surface2 }]}>
          <Text style={[styles.countText, { color: t.muted }]}>{collection.length}</Text>
        </View>
      </View>

      {/* Portfolio mini card */}
      <View style={styles.portfolioBar}>
        <View style={[styles.portfolioCard, { backgroundColor: t.surface, borderColor: t.line }]}>
          <Text style={[styles.portfolioLabel, { color: t.muted }]}>TOTAL VALUE</Text>
          <Text style={[styles.portfolioValue, { color: t.ink }]}>${totalValue.toLocaleString()}</Text>
        </View>
        <View style={[styles.portfolioCard, { backgroundColor: t.surface, borderColor: t.line }]}>
          <Text style={[styles.portfolioLabel, { color: t.muted }]}>CARDS</Text>
          <Text style={[styles.portfolioValue, { color: t.ink }]}>{collection.length}</Text>
        </View>
      </View>

      {/* Search bar */}
      <View style={[styles.searchBar, { backgroundColor: t.surface, borderColor: t.line2 }]}>
        <Text style={[styles.searchIcon, { color: t.muted }]}>⌕</Text>
        <TextInput
          style={[styles.searchInput, { color: t.ink }]}
          value={search}
          onChangeText={setSearch}
          placeholder="Search cards…"
          placeholderTextColor={t.muted2}
          returnKeyType="search"
          autoCorrect={false}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')} hitSlop={8}>
            <Text style={[styles.searchClear, { color: t.muted }]}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Filter chips */}
      <View style={styles.filtersWrap}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTERS}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.filters}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setFilter(item.key)}
              style={[
                styles.chip,
                {
                  backgroundColor: filter === item.key ? t.accent : t.surface2,
                  borderColor: filter === item.key ? t.accent : t.line2,
                },
              ]}
            >
              <Text style={[styles.chipText, { color: filter === item.key ? t.accentInk : t.muted }]}>
                {item.label}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* Grid */}
      {filtered.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={[styles.emptyTitle, { color: t.ink }]}>No cards yet</Text>
          <Text style={[styles.emptyBody, { color: t.muted2 }]}>
            Scan a card to add it to your collection.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(c) => c.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => <CardGridItem card={item} onDelete={() => removeCard(item.id)} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingTop: 4, paddingBottom: 8 },
  titleText: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 24, letterSpacing: -0.4 },
  countBadge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 100 },
  countText: { fontFamily: 'DMMono_400Regular', fontSize: 12 },
  portfolioBar: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 10 },
  portfolioCard: { flex: 1, borderRadius: 16, borderWidth: 1, padding: 12 },
  portfolioLabel: { fontFamily: 'DMMono_400Regular', fontSize: 9, letterSpacing: 0.8, marginBottom: 4 },
  portfolioValue: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 18 },
  filtersWrap: { marginBottom: 10 },
  filters: { paddingHorizontal: 20, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 100, borderWidth: 1 },
  chipText: { fontFamily: 'HankenGrotesk_600SemiBold', fontSize: 12 },
  grid: { paddingHorizontal: 16, paddingBottom: 20 },
  row: { gap: 10, marginBottom: 10 },
  gridItem: { flex: 1, borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  thumb: { height: 130, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center' },
  rawBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  rawBadgeText: { fontFamily: 'DMMono_400Regular', fontSize: 10 },
  gradeOverlay: { alignItems: 'center' },
  gradeNum: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 32 },
  gradeLabelWrap: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 4 },
  gradeLabel: { fontFamily: 'DMMono_400Regular', fontSize: 9, color: '#9fb0aa' },
  info: { padding: 10 },
  cardName: { fontFamily: 'HankenGrotesk_600SemiBold', fontSize: 13 },
  cardMeta: { fontFamily: 'DMMono_400Regular', fontSize: 10, marginTop: 2, marginBottom: 6 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  value: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 14 },
  delta: { fontFamily: 'DMMono_400Regular', fontSize: 11 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 20, marginBottom: 10 },
  emptyBody: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 14, lineHeight: 21, textAlign: 'center' },
  searchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 10, borderRadius: 14, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 9, gap: 8 },
  searchIcon: { fontSize: 18 },
  searchInput: { flex: 1, fontFamily: 'HankenGrotesk_500Medium', fontSize: 15, padding: 0 },
  searchClear: { fontSize: 13 },
});
