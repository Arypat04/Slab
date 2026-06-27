import React from 'react';
import {
  View, Text, Pressable, ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../src/theme';
import { useAppStore } from '../src/store/useAppStore';
import { SlabCard } from '../src/components/SlabCard';
import { ChevronLeftIcon } from '../src/components/Icons';

const PSA_GRADES = [10, 9, 8, 7];

function GradeBar({ grade, pct, highlight }: { grade: number; pct: number; highlight: boolean }) {
  const t = useTheme();
  return (
    <View style={styles.barRow}>
      <Text style={[styles.barLabel, { color: highlight ? t.accent : t.muted }]}>PSA {grade}</Text>
      <View style={[styles.barTrack, { backgroundColor: t.track }]}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: highlight ? '#00c2a8' : t.line }]} />
      </View>
      <Text style={[styles.barPct, { color: highlight ? t.accent : t.muted }]}>{pct}%</Text>
    </View>
  );
}

function CostRow({ label, value, positive, divider }: { label: string; value: string; positive?: boolean; divider?: boolean }) {
  const t = useTheme();
  return (
    <View style={[styles.costRow, divider && { borderTopWidth: 1, borderTopColor: t.line, marginTop: 8, paddingTop: 8 }]}>
      <Text style={[styles.costLabel, { color: t.muted }]}>{label}</Text>
      <Text style={[styles.costValue, { color: positive ? '#18b368' : t.ink }]}>{value}</Text>
    </View>
  );
}

export default function Roi() {
  const t = useTheme();
  const grade = useAppStore((s) => s.currentGrade);

  const g = grade ?? {
    cardName: 'Charizard ex',
    cardSet: 'POKÉMON 151',
    predictedGrade: 9,
    rawValue: 95,
    gradedValue: 430,
    psaGradedValue: 430,
    cgcGradedValue: 396,
    tgsGradedValue: 366,
    bgsGradedValue: 378,
    subGrades: { centering: 8.5, corners: 9.0, edges: 9.5, surface: 9.0 },
    centeringLR: { left: 55, right: 45 },
    centeringTB: { top: 50, bottom: 50 },
    cardNumber: '#199',
    variant: 'HOLO',
    gradeName: 'MINT',
    confidence: 92,
    defects: [],
    whyNot: 'Centering slightly left.',
  };

  const submissionFee = 22;
  const shippingFee = 19;
  const saleFee = Math.round(g.psaGradedValue * 0.12);
  const totalCost = g.rawValue + submissionFee + shippingFee + saleFee;
  const netProfit = g.psaGradedValue - totalCost;
  const isWorthIt = netProfit > 0;

  const gradePcts: Record<number, number> = { 10: 8, 9: 52, 8: 28, 7: 12 };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.line2 }]} hitSlop={8}>
          <ChevronLeftIcon color={t.ink} />
        </Pressable>
        <Text style={[styles.title, { color: t.ink }]}>Worth Grading?</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Verdict slab */}
        <SlabCard radius={22} padding={20} style={{ marginBottom: 14 }}>
          <View style={styles.glowCircle} />
          <View style={styles.verdictRow}>
            <View>
              <Text style={styles.verdictEyebrow}>VERDICT</Text>
              <Text style={[styles.verdictTitle, { color: isWorthIt ? '#00c2a8' : '#f0533f' }]}>
                {isWorthIt ? 'Worth Grading' : 'Skip It'}
              </Text>
              <Text style={styles.verdictSub}>{g.cardName}</Text>
            </View>
            <View style={[styles.netBadge, { backgroundColor: isWorthIt ? 'rgba(0,194,168,0.15)' : 'rgba(240,83,63,0.15)' }]}>
              <Text style={[styles.netSign, { color: isWorthIt ? '#00c2a8' : '#f0533f' }]}>
                {isWorthIt ? '+' : '-'}
              </Text>
              <Text style={[styles.netAmount, { color: isWorthIt ? '#00c2a8' : '#f0533f' }]}>
                ${Math.abs(netProfit)}
              </Text>
              <Text style={[styles.netLabel, { color: isWorthIt ? '#7fe9d8' : '#f0a49a' }]}>net</Text>
            </View>
          </View>
        </SlabCard>

        {/* Raw vs Graded */}
        <View style={[styles.valuesRow, { marginBottom: 14 }]}>
          <View style={[styles.valueCard, { backgroundColor: t.surface, borderColor: t.line }]}>
            <Text style={[styles.valueLabel, { color: t.muted }]}>RAW VALUE</Text>
            <Text style={[styles.valueNum, { color: t.ink }]}>${g.rawValue}</Text>
          </View>
          <View style={styles.arrow}>
            <Text style={[styles.arrowText, { color: t.muted }]}>→</Text>
          </View>
          <View style={[styles.valueCard, { backgroundColor: t.surface, borderColor: t.line }]}>
            <Text style={[styles.valueLabel, { color: t.muted }]}>PSA {g.predictedGrade}</Text>
            <Text style={[styles.valueNum, { color: '#00c2a8' }]}>${g.psaGradedValue}</Text>
          </View>
        </View>

        {/* Grade probability */}
        <View style={[styles.section, { backgroundColor: t.surface, borderColor: t.line }]}>
          <Text style={[styles.sectionTitle, { color: t.ink }]}>Grade Probability</Text>
          {PSA_GRADES.map((gr) => (
            <GradeBar
              key={gr}
              grade={gr}
              pct={gradePcts[gr] ?? 0}
              highlight={gr === g.predictedGrade}
            />
          ))}
        </View>

        {/* Multi-grader comparison */}
        <View style={[styles.section, { backgroundColor: t.surface, borderColor: t.line }]}>
          <Text style={[styles.sectionTitle, { color: t.ink }]}>Multi-Grader Value</Text>
          {[
            { label: 'PSA', value: g.psaGradedValue },
            { label: 'CGC', value: g.cgcGradedValue },
            { label: 'BGS', value: g.bgsGradedValue },
            { label: 'TGS', value: g.tgsGradedValue },
          ].map(({ label, value }, i) => (
            <View
              key={label}
              style={[styles.graderRow, i < 3 && { borderBottomWidth: 1, borderBottomColor: t.line }]}
            >
              <View style={[styles.graderBadge, { backgroundColor: t.surface2 }]}>
                <Text style={[styles.graderLabel, { color: t.muted }]}>{label}</Text>
              </View>
              <View style={[styles.graderBarTrack, { backgroundColor: t.track }]}>
                <View style={[styles.graderBarFill, { width: `${(value / 500) * 100}%` }]} />
              </View>
              <Text style={[styles.graderValue, { color: t.ink }]}>${value}</Text>
            </View>
          ))}
        </View>

        {/* Cost breakdown */}
        <View style={[styles.section, { backgroundColor: t.surface, borderColor: t.line }]}>
          <Text style={[styles.sectionTitle, { color: t.ink }]}>Cost Breakdown</Text>
          <CostRow label="Card purchase" value={`$${g.rawValue}`} />
          <CostRow label="PSA submission fee" value={`$${submissionFee}`} />
          <CostRow label="Shipping (est.)" value={`$${shippingFee}`} />
          <CostRow label="Sale fee (12%)" value={`$${saleFee}`} />
          <CostRow label="Total cost" value={`$${totalCost}`} divider />
          <CostRow label={`Sale price (PSA ${g.predictedGrade})`} value={`$${g.psaGradedValue}`} />
          <CostRow label="Net profit" value={`${isWorthIt ? '+' : '-'}$${Math.abs(netProfit)}`} positive={isWorthIt} divider />
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View style={[styles.footer, { backgroundColor: t.footer, borderTopColor: t.line }]}>
        <Pressable style={styles.submitBtn} onPress={() => router.back()}>
          <Text style={styles.submitText}>Back to Grade Result</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 14, paddingTop: 4 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 17 },
  glowCircle: { position: 'absolute', right: -24, top: -24, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(0,194,168,0.4)' },
  verdictRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  verdictEyebrow: { fontFamily: 'DMMono_400Regular', fontSize: 10, letterSpacing: 1.2, color: '#7fe9d8', marginBottom: 3 },
  verdictTitle: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 22, marginBottom: 3 },
  verdictSub: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 12, color: '#9fb0aa' },
  netBadge: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, alignItems: 'center' },
  netSign: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 14 },
  netAmount: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 30, lineHeight: 32 },
  netLabel: { fontFamily: 'DMMono_400Regular', fontSize: 10 },
  valuesRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  valueCard: { flex: 1, borderRadius: 16, borderWidth: 1, padding: 14 },
  valueLabel: { fontFamily: 'DMMono_400Regular', fontSize: 10, letterSpacing: 0.8, marginBottom: 5 },
  valueNum: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 26 },
  arrow: { width: 28, alignItems: 'center' },
  arrowText: { fontSize: 20 },
  section: { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 12 },
  sectionTitle: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 14, marginBottom: 12 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  barLabel: { fontFamily: 'DMMono_400Regular', fontSize: 11, width: 44 },
  barTrack: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  barPct: { fontFamily: 'DMMono_400Regular', fontSize: 11, width: 34, textAlign: 'right' },
  graderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9 },
  graderBadge: { width: 36, paddingVertical: 4, alignItems: 'center', borderRadius: 6 },
  graderLabel: { fontFamily: 'DMMono_500Medium', fontSize: 11 },
  graderBarTrack: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  graderBarFill: { height: '100%', backgroundColor: '#00c2a8', borderRadius: 3 },
  graderValue: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 14, width: 48, textAlign: 'right' },
  costRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  costLabel: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 13 },
  costValue: { fontFamily: 'HankenGrotesk_600SemiBold', fontSize: 13 },
  footer: { padding: 16, paddingBottom: 22, borderTopWidth: 1 },
  submitBtn: { height: 52, borderRadius: 16, backgroundColor: '#00c2a8', alignItems: 'center', justifyContent: 'center' },
  submitText: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 16, color: '#04332c' },
});
