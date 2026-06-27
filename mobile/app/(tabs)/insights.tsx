import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { useTheme } from '../../src/theme';
import { useAppStore } from '../../src/store/useAppStore';
import { Sparkline } from '../../src/components/Sparkline';

const SPARK = '0,40 1,44 2,38 3,50 4,48 5,54 6,52 7,60 8,58 9,66 10,64 11,72 12,68 13,75 14,80';

function parseGradeNum(grade: string): number {
  return parseFloat(grade.replace('PSA ', '')) || 0;
}

function GemRateMeter({ value }: { value: number }) {
  const t = useTheme();
  const pct = value * 10;
  return (
    <View style={[styles.meterCard, { backgroundColor: t.surface, borderColor: t.line }]}>
      <Text style={[styles.meterLabel, { color: t.muted }]}>GEM RATE</Text>
      <View style={styles.meterValueRow}>
        <Text style={[styles.meterValue, { color: t.ink }]}>{value.toFixed(1)}</Text>
        <Text style={[styles.meterSub, { color: t.muted }]}> avg grade</Text>
      </View>
      <View style={[styles.meterTrack, { backgroundColor: t.track }]}>
        <View style={[styles.meterFill, { width: `${pct}%` }]} />
      </View>
      <Text style={[styles.meterCaption, { color: t.muted2 }]}>
        {value >= 9 ? 'Excellent — your cards grade out well' : value >= 8 ? 'Above average collection' : 'Room to upgrade raw picks'}
      </Text>
    </View>
  );
}

export default function Insights() {
  const t = useTheme();
  const collection = useAppStore((s) => s.collection);

  const graded = collection.filter((c) => !c.isRaw);
  const avgGrade = graded.length > 0
    ? graded.reduce((s, c) => s + parseGradeNum(c.grade), 0) / graded.length
    : 0;
  const totalValue = collection.reduce((s, c) => s + c.value, 0);
  const totalCost = collection.reduce((s, c) => s + (c.purchasePrice ?? 0), 0);

  // Allocation by game
  const gameMap: Record<string, number> = {};
  for (const c of collection) {
    const g = c.game ?? 'Other';
    gameMap[g] = (gameMap[g] ?? 0) + c.value;
  }
  const games = Object.entries(gameMap).sort((a, b) => b[1] - a[1]);

  // Top performers (highest gain %)
  const topPerformers = [...collection]
    .filter((c) => c.purchasePrice && c.purchasePrice > 0)
    .sort((a, b) => {
      const aG = (a.value - (a.purchasePrice ?? 0)) / (a.purchasePrice ?? 1);
      const bG = (b.value - (b.purchasePrice ?? 0)) / (b.purchasePrice ?? 1);
      return bG - aG;
    })
    .slice(0, 3);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: t.ink }]}>Insights</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}
      >
        {/* Portfolio value over time */}
        <View style={[styles.section, { backgroundColor: t.surface, borderColor: t.line }]}>
          <Text style={[styles.sectionTitle, { color: t.ink }]}>Portfolio Trend</Text>
          <Text style={[styles.bigNum, { color: t.ink }]}>${totalValue.toLocaleString()}</Text>
          <Sparkline points={SPARK} width={340} height={64} color="#00c2a8" />
          <View style={styles.trendRow}>
            <View style={styles.trendItem}>
              <Text style={[styles.trendLabel, { color: t.muted }]}>Cost Basis</Text>
              <Text style={[styles.trendValue, { color: t.ink }]}>${totalCost.toLocaleString()}</Text>
            </View>
            <View style={styles.trendItem}>
              <Text style={[styles.trendLabel, { color: t.muted }]}>Cards</Text>
              <Text style={[styles.trendValue, { color: t.ink }]}>{collection.length}</Text>
            </View>
            <View style={styles.trendItem}>
              <Text style={[styles.trendLabel, { color: t.muted }]}>Graded</Text>
              <Text style={[styles.trendValue, { color: t.ink }]}>{graded.length}</Text>
            </View>
          </View>
        </View>

        {/* Gem rate */}
        {graded.length > 0 && <GemRateMeter value={avgGrade} />}

        {/* Allocation */}
        {games.length > 0 && (
          <View style={[styles.section, { backgroundColor: t.surface, borderColor: t.line }]}>
            <Text style={[styles.sectionTitle, { color: t.ink }]}>Allocation</Text>
            {games.map(([game, val]) => {
              const pct = totalValue > 0 ? (val / totalValue) * 100 : 0;
              return (
                <View key={game} style={styles.allocRow}>
                  <Text style={[styles.allocLabel, { color: t.muted }]}>{game}</Text>
                  <View style={[styles.allocTrack, { backgroundColor: t.track }]}>
                    <View style={[styles.allocFill, { width: `${pct}%` }]} />
                  </View>
                  <Text style={[styles.allocPct, { color: t.ink }]}>{pct.toFixed(0)}%</Text>
                  <Text style={[styles.allocVal, { color: t.muted }]}>${val}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Top performers */}
        {topPerformers.length > 0 && (
          <View style={[styles.section, { backgroundColor: t.surface, borderColor: t.line }]}>
            <Text style={[styles.sectionTitle, { color: t.ink }]}>Top Performers</Text>
            {topPerformers.map((card, i) => {
              const gainAmt = card.value - (card.purchasePrice ?? 0);
              const gainPct = card.purchasePrice ? ((gainAmt / card.purchasePrice) * 100).toFixed(1) : '—';
              const isPos = gainAmt >= 0;
              return (
                <View
                  key={card.id}
                  style={[styles.perfRow, i < topPerformers.length - 1 && { borderBottomWidth: 1, borderBottomColor: t.line }]}
                >
                  <View style={[styles.perfRank, { backgroundColor: t.surface2 }]}>
                    <Text style={[styles.perfRankText, { color: t.muted }]}>#{i + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.perfName, { color: t.ink }]} numberOfLines={1}>{card.name}</Text>
                    <Text style={[styles.perfMeta, { color: t.muted }]}>${card.purchasePrice} → ${card.value}</Text>
                  </View>
                  <Text style={[styles.perfDelta, { color: isPos ? '#18b368' : '#f0533f' }]}>
                    {isPos ? '+' : ''}{gainPct}%
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {collection.length === 0 && (
          <View style={styles.emptyWrap}>
            <Text style={[styles.emptyTitle, { color: t.ink }]}>No data yet</Text>
            <Text style={[styles.emptyBody, { color: t.muted2 }]}>
              Grade some cards to see insights about your collection.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 12 },
  title: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 24, letterSpacing: -0.4 },
  section: { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 12 },
  sectionTitle: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 14, marginBottom: 10 },
  bigNum: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 28, marginBottom: 8 },
  trendRow: { flexDirection: 'row', marginTop: 12, gap: 0 },
  trendItem: { flex: 1, alignItems: 'center' },
  trendLabel: { fontFamily: 'DMMono_400Regular', fontSize: 10, marginBottom: 3 },
  trendValue: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 14 },
  meterCard: { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 12 },
  meterLabel: { fontFamily: 'DMMono_400Regular', fontSize: 10, letterSpacing: 0.8, marginBottom: 4 },
  meterValueRow: { flexDirection: 'row', alignItems: 'baseline' },
  meterValue: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 36 },
  meterSub: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 13 },
  meterTrack: { height: 8, borderRadius: 4, overflow: 'hidden', marginVertical: 10 },
  meterFill: { height: '100%', backgroundColor: '#00c2a8', borderRadius: 4 },
  meterCaption: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 12 },
  allocRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  allocLabel: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 12, width: 72 },
  allocTrack: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  allocFill: { height: '100%', backgroundColor: '#5b6cff', borderRadius: 4 },
  allocPct: { fontFamily: 'DMMono_400Regular', fontSize: 11, width: 32, textAlign: 'right' },
  allocVal: { fontFamily: 'DMMono_400Regular', fontSize: 11, width: 42, textAlign: 'right' },
  perfRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  perfRank: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  perfRankText: { fontFamily: 'DMMono_500Medium', fontSize: 11 },
  perfName: { fontFamily: 'HankenGrotesk_600SemiBold', fontSize: 13 },
  perfMeta: { fontFamily: 'DMMono_400Regular', fontSize: 10, marginTop: 1 },
  perfDelta: { fontFamily: 'DMMono_500Medium', fontSize: 13 },
  emptyWrap: { paddingTop: 40, alignItems: 'center' },
  emptyTitle: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 20, marginBottom: 10 },
  emptyBody: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 14, lineHeight: 21, textAlign: 'center' },
});
