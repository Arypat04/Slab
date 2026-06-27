import React, { useEffect, useState } from 'react';
import {
  View, Text, Pressable, FlatList, StyleSheet, SafeAreaView,
  TextInput, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../src/theme';
import { useAppStore } from '../src/store/useAppStore';
import { searchCards, type CardSearchResult } from '../src/api/grader';
import { ChevronLeftIcon } from '../src/components/Icons';

const GAME_COLORS: Record<string, string> = {
  Pokemon: '#FFB74D',
  NHL: '#42A5F5',
  NBA: '#EF5350',
  NFL: '#66BB6A',
  MLB: '#26C6DA',
  MTG: '#AB47BC',
  Other: '#78909C',
};

export default function CardSearch() {
  const t = useTheme();
  const currentGrade = useAppStore((s) => s.currentGrade);
  const patchCurrentGrade = useAppStore((s) => s.patchCurrentGrade);

  const [query, setQuery] = useState(currentGrade?.cardName ?? '');
  const [results, setResults] = useState<CardSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const doSearch = async (q = query) => {
    if (q.trim().length < 2) return;
    setLoading(true);
    setError(null);
    try {
      const cards = await searchCards(q.trim());
      setResults(cards);
      setSearched(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query.trim().length >= 2) doSearch(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectCard = (card: CardSearchResult) => {
    patchCurrentGrade({
      cardName: card.cardName,
      cardSet: card.cardSet,
      cardNumber: card.cardNumber,
      variant: card.variant,
      rawValue: card.rawValue,
      gradedValue: card.gradedValue,
      psaGradedValue: card.psaGradedValue,
      cgcGradedValue: card.cgcGradedValue,
    });
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.line2 }]}
          hitSlop={8}
        >
          <ChevronLeftIcon color={t.ink} />
        </Pressable>
        <Text style={[styles.title, { color: t.ink }]}>Find Your Card</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: t.surface, borderColor: t.line2, color: t.ink }]}
          value={query}
          onChangeText={setQuery}
          placeholder="e.g. Jared McCann Young Guns"
          placeholderTextColor={t.muted2}
          returnKeyType="search"
          onSubmitEditing={() => doSearch(query)}
          autoCorrect={false}
        />
        <Pressable
          onPress={() => doSearch(query)}
          style={[styles.searchBtn, loading && { opacity: 0.6 }]}
          disabled={loading}
        >
          <Text style={styles.searchBtnText}>Search</Text>
        </Pressable>
      </View>

      <Text style={[styles.hint, { color: t.muted2 }]}>
        Search by player, card name, or set · tap a result to use it
      </Text>

      {/* States */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#00c2a8" size="large" />
          <Text style={[styles.stateText, { color: t.muted2 }]}>Finding cards…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.stateTitle, { color: t.ink }]}>Search failed</Text>
          <Text style={[styles.stateText, { color: t.muted2 }]}>{error}</Text>
          <Pressable onPress={() => doSearch(query)} style={styles.retryBtn}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : searched && results.length === 0 ? (
        <View style={styles.center}>
          <Text style={[styles.stateTitle, { color: t.ink }]}>No results</Text>
          <Text style={[styles.stateText, { color: t.muted2 }]}>Try a different search term.</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const gameColor = GAME_COLORS[item.game] ?? GAME_COLORS.Other;
            return (
              <Pressable
                onPress={() => selectCard(item)}
                style={[styles.resultCard, { backgroundColor: t.surface, borderColor: t.line }]}
              >
                <View style={styles.resultTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.resultName, { color: t.ink }]}>{item.cardName}</Text>
                    <Text style={[styles.resultMeta, { color: t.muted }]}>
                      {[item.cardSet, item.cardNumber, item.variant].filter(Boolean).join(' · ')}
                    </Text>
                  </View>
                  <View style={[styles.gameChip, { backgroundColor: `${gameColor}22` }]}>
                    <Text style={[styles.gameChipText, { color: gameColor }]}>{item.game}</Text>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: t.line }]} />

                <View style={styles.valueRow}>
                  <View style={styles.valueItem}>
                    <Text style={[styles.valueLabel, { color: t.muted2 }]}>RAW</Text>
                    <Text style={[styles.valueNum, { color: t.ink }]}>${item.rawValue}</Text>
                  </View>
                  <View style={[styles.valueSep, { backgroundColor: t.line2 }]} />
                  <View style={styles.valueItem}>
                    <Text style={[styles.valueLabel, { color: t.muted2 }]}>PSA 9</Text>
                    <Text style={[styles.valueNum, { color: '#00c2a8' }]}>${item.gradedValue}</Text>
                  </View>
                  <View style={[styles.valueSep, { backgroundColor: t.line2 }]} />
                  <View style={styles.valueItem}>
                    <Text style={[styles.valueLabel, { color: t.muted2 }]}>CGC 9</Text>
                    <Text style={[styles.valueNum, { color: t.ink }]}>${item.cgcGradedValue}</Text>
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 14, paddingTop: 4,
  },
  iconBtn: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 17 },
  searchRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 8 },
  searchInput: {
    flex: 1, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12,
    fontFamily: 'HankenGrotesk_500Medium', fontSize: 15,
  },
  searchBtn: {
    backgroundColor: '#00c2a8', paddingHorizontal: 18, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  searchBtnText: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 14, color: '#04332c' },
  hint: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 12, paddingHorizontal: 20, marginBottom: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  stateTitle: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 18, marginBottom: 8 },
  stateText: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 14, textAlign: 'center', marginTop: 10 },
  retryBtn: { marginTop: 20, backgroundColor: '#00c2a8', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  retryText: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 14, color: '#04332c' },
  list: { paddingHorizontal: 20, paddingBottom: 30 },
  resultCard: { borderRadius: 18, borderWidth: 1, padding: 14, marginBottom: 12 },
  resultTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  resultName: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 16, marginBottom: 3 },
  resultMeta: { fontFamily: 'DMMono_400Regular', fontSize: 11 },
  gameChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, flexShrink: 0 },
  gameChipText: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 11 },
  divider: { height: 1, marginBottom: 10 },
  valueRow: { flexDirection: 'row', alignItems: 'center' },
  valueItem: { flex: 1, alignItems: 'center' },
  valueSep: { width: 1, height: 28 },
  valueLabel: { fontFamily: 'DMMono_400Regular', fontSize: 10, letterSpacing: 0.6, marginBottom: 2 },
  valueNum: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 16 },
});
