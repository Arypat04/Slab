import React, { useState } from 'react';
import {
  View, Text, Pressable, ScrollView, StyleSheet, SafeAreaView, Modal, TextInput,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../src/theme';
import { useAppStore } from '../src/store/useAppStore';
import type { CardItem } from '../src/types';
import { SlabCard } from '../src/components/SlabCard';
import { Sparkline } from '../src/components/Sparkline';
import { ChevronLeftIcon, BellIcon } from '../src/components/Icons';

type Tab = 'price' | 'yours' | 'notes';

function generateSparkPoints(value: number, id: string): string {
  if (value <= 0) return Array.from({ length: 15 }, (_, i) => `${i},50`).join(' ');
  const seed = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const start = value * 0.74;
  return Array.from({ length: 15 }, (_, i) => {
    const trend = start + (value - start) * (i / 14);
    const wave = Math.sin(i * 1.4 + (seed % 10) * 0.3) * value * 0.04;
    return `${i},${Math.round(Math.max(1, trend + wave))}`;
  }).join(' ');
}

function generateRecentSales(card: CardItem) {
  const gradeNum = parseFloat(card.grade.replace('PSA ', '')) || 0;
  const sales: { grade: string; price: number; date: string }[] = [
    { grade: card.isRaw ? 'RAW' : card.grade, price: card.value, date: '2d ago' },
    { grade: card.isRaw ? 'RAW' : card.grade, price: Math.round(card.value * 0.96), date: '7d ago' },
  ];
  if (!card.isRaw && gradeNum >= 2) {
    sales.push({ grade: `PSA ${gradeNum - 1}`, price: Math.round(card.value * 0.62), date: '13d ago' });
  }
  return sales;
}

export default function Detail() {
  const t = useTheme();
  const [tab, setTab] = useState<Tab>('price');
  const [alertModal, setAlertModal] = useState(false);
  const [alertInput, setAlertInput] = useState('');
  const { id } = useLocalSearchParams<{ id?: string }>();
  const collection = useAppStore((s) => s.collection);
  const priceAlerts = useAppStore((s) => s.priceAlerts);
  const setPriceAlert = useAppStore((s) => s.setPriceAlert);
  const card = collection.find((c) => c.id === id) ?? collection[0];

  if (!card) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
        <Pressable onPress={() => router.back()} style={{ padding: 20 }} hitSlop={8}>
          <ChevronLeftIcon color={t.ink} />
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[{ color: t.muted }]}>Card not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const gain = card.value - (card.purchasePrice ?? 0);
  const gainPct = card.purchasePrice ? ((gain / card.purchasePrice) * 100).toFixed(1) : '—';
  const isPos = gain >= 0;
  const currentAlert = priceAlerts[card.id] ?? null;
  const sparkPoints = generateSparkPoints(card.value, card.id);
  const recentSales = generateRecentSales(card);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.line2 }]} hitSlop={8}>
          <ChevronLeftIcon color={t.ink} />
        </Pressable>
        <Text style={[styles.title, { color: t.ink }]} numberOfLines={1}>{card.name}</Text>
        <Pressable
          onPress={() => { setAlertInput(currentAlert?.toString() ?? ''); setAlertModal(true); }}
          style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.line2 }]}
          hitSlop={8}
        >
          <BellIcon color={currentAlert ? t.accent : t.ink} size={16} />
        </Pressable>
      </View>

      {/* Dark hero slab */}
      <SlabCard radius={0} padding={20} style={{ borderRadius: 0 }}>
        <View style={styles.glowCircle} />
        <View style={styles.heroRow}>
          {/* Card thumb placeholder */}
          <View style={styles.heroThumb}>
            <View style={[styles.thumbInner, { borderColor: 'rgba(255,255,255,0.18)' }]}>
              {card.isRaw ? (
                <View style={styles.rawBadge}>
                  <Text style={styles.rawBadgeText}>RAW</Text>
                </View>
              ) : (
                <Text style={styles.gradeNumHero}>{card.grade.replace('PSA ', '')}</Text>
              )}
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.heroName}>{card.name}</Text>
            <Text style={styles.heroMeta}>
              {[card.set, card.cardNumber, card.variant].filter(Boolean).join(' · ')}
            </Text>
            <View style={styles.heroPriceRow}>
              <Text style={styles.heroPrice}>${card.value}</Text>
              <View style={[styles.heroDelta, { backgroundColor: isPos ? 'rgba(94,228,159,0.18)' : 'rgba(240,83,63,0.18)' }]}>
                <Text style={[styles.heroDeltaText, { color: isPos ? '#5ee49f' : '#f0533f' }]}>
                  {isPos ? '+' : ''}{gainPct}%
                </Text>
              </View>
            </View>
            {card.certNumber && (
              <Text style={styles.certNum}>CERT #{card.certNumber}</Text>
            )}
          </View>
        </View>

        {/* Tab strip */}
        <View style={styles.tabStrip}>
          {(['price', 'yours', 'notes'] as Tab[]).map((t2) => (
            <Pressable key={t2} onPress={() => setTab(t2)} style={[styles.tabItem, tab === t2 && styles.tabItemActive]}>
              <Text style={[styles.tabText, { color: tab === t2 ? '#00c2a8' : '#7fe9d8' }]}>
                {t2 === 'price' ? 'Price History' : t2 === 'yours' ? 'Your Data' : 'Notes'}
              </Text>
            </Pressable>
          ))}
        </View>
      </SlabCard>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'price' && (
          <View>
            <View style={[styles.chartCard, { backgroundColor: t.surface, borderColor: t.line }]}>
              <View style={styles.chartTop}>
                <View>
                  <Text style={[styles.chartLabel, { color: t.muted }]}>CURRENT VALUE</Text>
                  <Text style={[styles.chartValue, { color: t.ink }]}>${card.value}</Text>
                </View>
                <View style={[styles.deltaChip, { backgroundColor: isPos ? 'rgba(24,179,104,0.12)' : 'rgba(240,83,63,0.12)' }]}>
                  <Text style={[styles.deltaChipText, { color: isPos ? '#18b368' : '#f0533f' }]}>
                    {isPos ? '+' : ''}${gain} · {gainPct}%
                  </Text>
                </View>
              </View>
              <Sparkline points={sparkPoints} width={320} height={80} color="#00c2a8" />
              <View style={styles.rangePills}>
                {['1W', '1M', '3M', '1Y', 'ALL'].map((r) => (
                  <Pressable key={r} style={[styles.rangePill, r === '3M' && { backgroundColor: t.accent }]}>
                    <Text style={[styles.rangePillText, { color: r === '3M' ? t.accentInk : t.muted }]}>{r}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={[styles.compSection, { backgroundColor: t.surface, borderColor: t.line }]}>
              <Text style={[styles.compTitle, { color: t.ink }]}>Recent Sales</Text>
              {recentSales.map(({ grade, price, date }) => (
                <View key={date} style={[styles.compRow, { borderBottomColor: t.line }]}>
                  <Text style={[styles.compGrade, { color: t.muted }]}>{grade}</Text>
                  <Text style={[styles.compPrice, { color: t.ink }]}>${price}</Text>
                  <Text style={[styles.compDate, { color: t.muted2 }]}>{date}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {tab === 'yours' && (
          <View style={[styles.section, { backgroundColor: t.surface, borderColor: t.line }]}>
            {[
              { label: 'Purchase Price', value: `$${card.purchasePrice ?? '—'}` },
              { label: 'Current Value', value: `$${card.value}` },
              { label: 'Gain / Loss', value: `${isPos ? '+' : ''}$${gain}`, highlight: true },
              { label: 'Game', value: card.game ?? '—' },
              { label: 'Card Number', value: card.cardNumber ?? '—' },
              { label: 'Variant', value: card.variant ?? '—' },
              { label: 'Grade', value: card.isRaw ? 'RAW' : card.grade },
              { label: 'Cert Number', value: card.certNumber ?? '—' },
              { label: 'Added', value: new Date(card.createdAt).toLocaleDateString() },
            ].map(({ label, value, highlight }, i) => (
              <View key={label} style={[styles.dataRow, i < 8 && { borderBottomWidth: 1, borderBottomColor: t.line }]}>
                <Text style={[styles.dataLabel, { color: t.muted }]}>{label}</Text>
                <Text style={[styles.dataValue, { color: highlight ? (isPos ? '#18b368' : '#f0533f') : t.ink }]}>
                  {value}
                </Text>
              </View>
            ))}
          </View>
        )}

        {tab === 'notes' && (
          <View style={[styles.section, { backgroundColor: t.surface, borderColor: t.line }]}>
            <Text style={[styles.notesPlaceholder, { color: t.muted2 }]}>
              No notes yet. Tap + to add a note about this card.
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={alertModal} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setAlertModal(false)} />
          <View style={[styles.alertSheet, { backgroundColor: t.surface }]}>
            {/* Card context row */}
            <View style={[styles.alertCardRow, { backgroundColor: t.surface2, borderColor: t.line }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.alertCardName, { color: t.ink }]} numberOfLines={1}>{card.name}</Text>
                <Text style={[styles.alertCardSet, { color: t.muted }]} numberOfLines={1}>{card.set}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.alertCardLabel, { color: t.muted }]}>CURRENT</Text>
                <Text style={[styles.alertCardPrice, { color: t.ink }]}>${card.value}</Text>
              </View>
            </View>

            <Text style={[styles.alertTitle, { color: t.ink }]}>Set Price Alert</Text>
            <Text style={[styles.alertSub, { color: t.muted }]}>
              We'll notify you when this card reaches your target price
            </Text>

            <TextInput
              style={[styles.alertInput, { color: t.ink, borderColor: t.line2, backgroundColor: t.surface2 }]}
              value={alertInput}
              onChangeText={setAlertInput}
              placeholder={`e.g. ${Math.round(card.value * 1.3)}`}
              placeholderTextColor={t.muted2 ?? t.muted}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={() => {
                const target = parseFloat(alertInput);
                if (target > 0) setPriceAlert(card.id, target);
                setAlertModal(false);
              }}
            />
            {currentAlert !== null && (
              <Text style={[styles.alertCurrent, { color: t.muted }]}>
                Active alert at ${currentAlert}
              </Text>
            )}

            <View style={styles.alertBtns}>
              {currentAlert !== null && (
                <Pressable
                  style={[styles.alertBtnOutline, { borderColor: '#f0533f' }]}
                  onPress={() => { setPriceAlert(card.id, null); setAlertModal(false); }}
                >
                  <Text style={[styles.alertBtnText, { color: '#f0533f' }]}>Remove</Text>
                </Pressable>
              )}
              <Pressable
                style={styles.alertBtnPrimary}
                onPress={() => {
                  const target = parseFloat(alertInput);
                  if (target > 0) setPriceAlert(card.id, target);
                  setAlertModal(false);
                }}
              >
                <Text style={styles.alertBtnPrimaryText}>Set Alert</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 10, paddingTop: 4 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 16, flex: 1, textAlign: 'center', marginHorizontal: 8 },
  glowCircle: { position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(0,194,168,0.35)' },
  heroRow: { flexDirection: 'row', gap: 16, marginBottom: 18 },
  heroThumb: { width: 88, height: 124, flexShrink: 0 },
  thumbInner: { flex: 1, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  rawBadge: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  rawBadgeText: { fontFamily: 'DMMono_400Regular', fontSize: 10, color: '#fff' },
  gradeNumHero: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 34, color: '#00c2a8' },
  heroName: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 18, color: '#fff', marginBottom: 3 },
  heroMeta: { fontFamily: 'DMMono_400Regular', fontSize: 10, color: '#9fb0aa', marginBottom: 10 },
  heroPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroPrice: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 26, color: '#fff' },
  heroDelta: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  heroDeltaText: { fontFamily: 'DMMono_500Medium', fontSize: 12 },
  certNum: { fontFamily: 'DMMono_400Regular', fontSize: 10, color: '#7fe9d8', marginTop: 6 },
  tabStrip: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  tabItem: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabItemActive: { borderBottomWidth: 2, borderBottomColor: '#00c2a8' },
  tabText: { fontFamily: 'HankenGrotesk_600SemiBold', fontSize: 13 },
  chartCard: { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 12 },
  chartTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  chartLabel: { fontFamily: 'DMMono_400Regular', fontSize: 10, letterSpacing: 0.8, marginBottom: 3 },
  chartValue: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 22 },
  deltaChip: { borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 },
  deltaChipText: { fontFamily: 'DMMono_500Medium', fontSize: 12 },
  rangePills: { flexDirection: 'row', gap: 6, marginTop: 10 },
  rangePill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
  rangePillText: { fontFamily: 'HankenGrotesk_600SemiBold', fontSize: 12 },
  compSection: { borderRadius: 18, borderWidth: 1, padding: 14 },
  compTitle: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 14, marginBottom: 10 },
  compRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1 },
  compGrade: { fontFamily: 'DMMono_400Regular', fontSize: 12, flex: 1 },
  compPrice: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 14, flex: 1, textAlign: 'center' },
  compDate: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 12, flex: 1, textAlign: 'right' },
  section: { borderRadius: 18, borderWidth: 1, paddingHorizontal: 14 },
  dataRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 11 },
  dataLabel: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 14 },
  dataValue: { fontFamily: 'HankenGrotesk_600SemiBold', fontSize: 14 },
  notesPlaceholder: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 14, lineHeight: 22, padding: 16 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  alertSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36 },
  alertCardRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 18, gap: 12 },
  alertCardName: { fontFamily: 'HankenGrotesk_600SemiBold', fontSize: 14, marginBottom: 2 },
  alertCardSet: { fontFamily: 'DMMono_400Regular', fontSize: 11 },
  alertCardLabel: { fontFamily: 'DMMono_400Regular', fontSize: 9, letterSpacing: 0.8, marginBottom: 2 },
  alertCardPrice: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 20 },
  alertTitle: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 18, marginBottom: 4 },
  alertSub: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 13, lineHeight: 19, marginBottom: 14 },
  alertInput: { borderRadius: 12, borderWidth: 1, padding: 14, fontFamily: 'HankenGrotesk_500Medium', fontSize: 22, marginBottom: 8 },
  alertCurrent: { fontFamily: 'DMMono_400Regular', fontSize: 12, marginBottom: 10 },
  alertBtns: { flexDirection: 'row', gap: 10, marginTop: 10 },
  alertBtnOutline: { flex: 1, borderWidth: 1, borderRadius: 14, height: 50, alignItems: 'center', justifyContent: 'center' },
  alertBtnText: { fontFamily: 'HankenGrotesk_600SemiBold', fontSize: 15 },
  alertBtnPrimary: { flex: 1, borderRadius: 14, height: 50, backgroundColor: '#00c2a8', alignItems: 'center', justifyContent: 'center' },
  alertBtnPrimaryText: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 15, color: '#04332c' },
});
