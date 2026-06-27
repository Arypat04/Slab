import React, { useEffect, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/theme';
import { useAppStore } from '../src/store/useAppStore';
import { CheckIcon } from '../src/components/Icons';

const PRO_FEATURES = [
  'Unlimited scans + sub-grades',
  'Multi-grader + ROI breakdown',
  'Grading Plays + submission tracker',
];

export default function Paywall() {
  const t = useTheme();
  const tier = useAppStore((s) => s.tier);
  const [launching, setLaunching] = useState(false);

  // If the RC entitlement listener already flipped us to pro, leave immediately
  useEffect(() => {
    if (tier === 'pro') router.replace('/(tabs)');
  }, [tier]);

  const openRCPaywall = async () => {
    setLaunching(true);
    try {
      const { PAYWALL_RESULT } = await import('react-native-purchases-ui');
      const RevenueCatUI = (await import('react-native-purchases-ui')).default;
      const result = await RevenueCatUI.presentPaywall();
      if (
        result === PAYWALL_RESULT.PURCHASED ||
        result === PAYWALL_RESULT.RESTORED
      ) {
        // entitlement listener in _layout will call setTier('pro');
        // the useEffect above will then navigate away
        router.replace('/(tabs)');
      }
    } catch (e) {
      // Native module not available (Expo Go) — fall back to mock grant
      console.warn('[paywall] RC UI not available, granting pro in dev mode');
      useAppStore.getState().setTier('pro');
      router.replace('/(tabs)');
    } finally {
      setLaunching(false);
    }
  };

  const continueFree = () => {
    useAppStore.getState().setTier('free');
    router.replace('/(tabs)');
  };

  const handleRestore = async () => {
    setLaunching(true);
    try {
      const RevenueCatUI = (await import('react-native-purchases-ui')).default;
      await RevenueCatUI.presentCustomerCenter();
    } catch {
      console.warn('[paywall] Customer Center not available');
    } finally {
      setLaunching(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/(tabs)')} hitSlop={12}>
          <Text style={[styles.close, { color: t.muted }]}>✕</Text>
        </Pressable>
        <Pressable onPress={handleRestore} hitSlop={12} disabled={launching}>
          <Text style={[styles.restore, { color: t.muted }]}>Restore</Text>
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.eyebrow, { color: t.accentDeep }]}>SLAB PRO</Text>
        <Text style={[styles.headline, { color: t.ink }]}>{'Grade smarter.\nBuy with an edge.'}</Text>

        {/* Pro slab */}
        <LinearGradient colors={['#11201b', '#15302a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.proSlab}>
          <View style={styles.glow} />
          <View style={styles.proRow}>
            <View>
              <Text style={styles.proTitle}>Pro</Text>
              <Text style={styles.proSub}>Everything, unlimited</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.proPrice}>$7<Text style={styles.priceSub}>/mo</Text></Text>
              <Text style={styles.priceBilled}>billed $84/yr</Text>
            </View>
          </View>
          <View style={styles.divider} />
          {PRO_FEATURES.map((f) => (
            <View key={f} style={styles.featureRow}>
              <View style={styles.checkCircle}>
                <CheckIcon color="#04332c" size={10} />
              </View>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </LinearGradient>

        {/* Plus + Free mini cards */}
        <View style={styles.miniRow}>
          <View style={[styles.miniCard, { borderColor: t.line2, backgroundColor: t.surface }]}>
            <Text style={[styles.miniTitle, { color: t.ink }]}>Plus</Text>
            <Text style={[styles.miniPrice, { color: t.muted2 }]}>$4/mo</Text>
          </View>
          <View style={[styles.miniCard, { borderColor: t.line2, backgroundColor: t.surface }]}>
            <Text style={[styles.miniTitle, { color: t.ink }]}>Free</Text>
            <Text style={[styles.miniPrice, { color: t.muted2 }]}>10 scans/mo</Text>
          </View>
        </View>
      </ScrollView>

      {/* CTAs */}
      <View style={[styles.ctas, { backgroundColor: t.bg }]}>
        <Pressable onPress={openRCPaywall} style={styles.trialBtn} disabled={launching}>
          {launching ? (
            <ActivityIndicator color="#04332c" />
          ) : (
            <Text style={styles.trialText}>See plans &amp; start free trial</Text>
          )}
        </Pressable>
        <Pressable onPress={continueFree} hitSlop={12} disabled={launching}>
          <Text style={[styles.freeText, { color: t.muted }]}>Continue with Free</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22, paddingBottom: 8 },
  close: { fontSize: 22, fontFamily: 'HankenGrotesk_400Regular' },
  restore: { fontSize: 13, fontFamily: 'HankenGrotesk_600SemiBold' },
  scroll: { paddingHorizontal: 22, paddingBottom: 20 },
  eyebrow: { fontFamily: 'DMMono_400Regular', fontSize: 12, letterSpacing: 1.4, marginBottom: 8 },
  headline: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 30, lineHeight: 34, letterSpacing: -0.6, marginBottom: 18 },
  proSlab: { borderRadius: 22, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', marginBottom: 12, overflow: 'hidden' },
  glow: { position: 'absolute', right: -26, top: -26, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(0,194,168,0.5)' },
  proRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  proTitle: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 20, color: '#fff' },
  proSub: { fontSize: 12, color: '#9fb0aa', fontFamily: 'HankenGrotesk_400Regular' },
  proPrice: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 26, color: '#fff' },
  priceSub: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 14, color: '#9fb0aa' },
  priceBilled: { fontSize: 11, color: '#7fe9d8', fontFamily: 'HankenGrotesk_400Regular' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.12)', marginVertical: 16 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 10 },
  checkCircle: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#00c2a8', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  featureText: { fontSize: 13, color: '#fff', fontFamily: 'HankenGrotesk_400Regular' },
  miniRow: { flexDirection: 'row', gap: 10 },
  miniCard: { flex: 1, borderWidth: 1, borderRadius: 16, padding: 14 },
  miniTitle: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 14, marginBottom: 2 },
  miniPrice: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 13 },
  ctas: { paddingHorizontal: 22, paddingBottom: 26, paddingTop: 8 },
  trialBtn: { height: 56, borderRadius: 18, backgroundColor: '#00c2a8', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  trialText: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 16, color: '#04332c' },
  freeText: { textAlign: 'center', fontSize: 13, fontFamily: 'HankenGrotesk_600SemiBold' },
});
