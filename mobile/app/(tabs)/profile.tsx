import React from 'react';
import {
  View, Text, Pressable, ScrollView, StyleSheet, SafeAreaView, Switch, Linking,
} from 'react-native';

const LEGAL_URLS = {
  privacy: 'https://YOUR_USERNAME.github.io/YOUR_REPO/privacy.html',
  terms: 'https://YOUR_USERNAME.github.io/YOUR_REPO/terms.html',
};
import { router } from 'expo-router';
import { useTheme } from '../../src/theme';
import { useAppStore } from '../../src/store/useAppStore';
import { SunIcon, MoonIcon, ArrowUpIcon } from '../../src/components/Icons';
import { requestNotificationPermissions, scheduleLocalNotification } from '../../src/services/notifications';

const TIER_COLORS: Record<string, string> = {
  pro: '#00c2a8',
  plus: '#5b6cff',
  free: '#9fb0aa',
};

const TIER_LABELS: Record<string, string> = {
  pro: 'PRO',
  plus: 'PLUS',
  free: 'FREE',
};

function SettingsRow({ label, value, onPress }: { label: string; value?: string; onPress?: () => void }) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.settingsRow, { borderBottomColor: t.line }]}
      disabled={!onPress}
    >
      <Text style={[styles.rowLabel, { color: t.ink }]}>{label}</Text>
      {value && <Text style={[styles.rowValue, { color: t.muted }]}>{value}</Text>}
    </Pressable>
  );
}

export default function Profile() {
  const t = useTheme();
  const theme = useAppStore((s) => s.theme);
  const tier = useAppStore((s) => s.tier);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const collection = useAppStore((s) => s.collection);
  const setOnboardingDone = useAppStore((s) => s.setOnboardingDone);

  const parseGradeNum = (g: string) => parseFloat(g.replace('PSA ', '')) || 0;
  const gradedCards = collection.filter((c) => !c.isRaw);
  const graded = gradedCards.length;
  const totalValue = collection.reduce((s, c) => s + c.value, 0);
  const avgGrade = graded > 0
    ? (gradedCards.reduce((s, c) => s + parseGradeNum(c.grade), 0) / graded).toFixed(1)
    : '—';

  const tierColor = TIER_COLORS[tier] ?? '#9fb0aa';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: t.ink }]}>Profile</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
      >
        {/* Avatar + tier */}
        <View style={styles.avatarWrap}>
          <View style={[styles.avatar, { backgroundColor: t.surface2, borderColor: t.line2 }]}>
            <Text style={[styles.avatarInitial, { color: t.ink }]}>C</Text>
          </View>
          <View style={[styles.tierBadge, { backgroundColor: tierColor + '22', borderColor: tierColor }]}>
            <Text style={[styles.tierText, { color: tierColor }]}>{TIER_LABELS[tier]}</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'CARDS', value: `${collection.length}` },
            { label: 'GRADED', value: `${graded}` },
            { label: 'AVG GRADE', value: avgGrade },
            { label: 'VALUE', value: `$${totalValue}` },
          ].map(({ label, value }) => (
            <View key={label} style={[styles.statCard, { backgroundColor: t.surface, borderColor: t.line }]}>
              <Text style={[styles.statLabel, { color: t.muted }]}>{label}</Text>
              <Text style={[styles.statValue, { color: t.ink }]}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Upgrade banner (if not pro) */}
        {tier !== 'pro' && (
          <Pressable
            onPress={() => router.push('/paywall')}
            style={[styles.upgradeBanner, { backgroundColor: t.accentDeep + '18', borderColor: t.accent }]}
          >
            <View>
              <Text style={[styles.upgradeTitle, { color: t.ink }]}>Upgrade to Pro</Text>
              <Text style={[styles.upgradeSub, { color: t.muted }]}>Unlimited scans + ROI insights</Text>
            </View>
            <ArrowUpIcon color={t.accent} />
          </Pressable>
        )}

        {/* Appearance */}
        <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.line }]}>
          <Text style={[styles.cardTitle, { color: t.muted }]}>APPEARANCE</Text>
          <View style={styles.appearanceRow}>
            <Pressable
              onPress={() => { if (theme === 'dark') toggleTheme(); }}
              style={[styles.appearanceBtn, theme === 'light' && { backgroundColor: t.accent }]}
            >
              <SunIcon color={theme === 'light' ? t.accentInk : t.muted} size={16} />
              <Text style={[styles.appearanceBtnText, { color: theme === 'light' ? t.accentInk : t.muted }]}>Light</Text>
            </Pressable>
            <Pressable
              onPress={() => { if (theme === 'light') toggleTheme(); }}
              style={[styles.appearanceBtn, theme === 'dark' && { backgroundColor: t.accent }]}
            >
              <MoonIcon color={theme === 'dark' ? t.accentInk : t.muted} size={16} />
              <Text style={[styles.appearanceBtnText, { color: theme === 'dark' ? t.accentInk : t.muted }]}>Dark</Text>
            </Pressable>
          </View>
        </View>

        {/* Settings */}
        <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.line }]}>
          <Text style={[styles.cardTitle, { color: t.muted }]}>ACCOUNT</Text>
          <SettingsRow label="Subscription" value={TIER_LABELS[tier]} onPress={() => router.push('/paywall')} />
          <SettingsRow
            label="Manage Subscription"
            onPress={async () => {
              try {
                const RevenueCatUI = (await import('react-native-purchases-ui')).default;
                await RevenueCatUI.presentCustomerCenter();
              } catch {
                console.warn('[profile] Customer Center not available');
              }
            }}
          />
          <SettingsRow label="Privacy Policy" onPress={() => Linking.openURL(LEGAL_URLS.privacy)} />
          <SettingsRow label="Terms of Service" onPress={() => Linking.openURL(LEGAL_URLS.terms)} />
          <SettingsRow label="Rate Slab" onPress={() => {}} />
        </View>

        {/* Dev tools */}
        <View style={styles.devRow}>
          <Pressable
            onPress={() => {
              setOnboardingDone(false);
              router.replace('/onboarding');
            }}
            style={[styles.resetBtn, { borderColor: t.line2, flex: 1 }]}
          >
            <Text style={[styles.resetText, { color: t.muted2 }]}>Reset Onboarding</Text>
          </Pressable>
          <Pressable
            onPress={async () => {
              const granted = await requestNotificationPermissions();
              if (granted) {
                await scheduleLocalNotification(
                  'Price Alert: Charizard ex',
                  'Charizard ex has reached your $500 target!',
                );
              }
            }}
            style={[styles.resetBtn, { borderColor: t.accent + '66', flex: 1 }]}
          >
            <Text style={[styles.resetText, { color: t.accent }]}>Test Notification</Text>
          </Pressable>
        </View>

        <Text style={[styles.version, { color: t.muted2 }]}>Slab v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 12 },
  title: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 24, letterSpacing: -0.4 },
  avatarWrap: { alignItems: 'center', paddingVertical: 20 },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarInitial: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 28 },
  tierBadge: { paddingHorizontal: 16, paddingVertical: 5, borderRadius: 100, borderWidth: 1 },
  tierText: { fontFamily: 'DMMono_500Medium', fontSize: 12, letterSpacing: 1 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  statCard: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 10, alignItems: 'center' },
  statLabel: { fontFamily: 'DMMono_400Regular', fontSize: 8, letterSpacing: 0.6, marginBottom: 4 },
  statValue: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 16 },
  upgradeBanner: { borderRadius: 16, borderWidth: 1, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  upgradeTitle: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 14, marginBottom: 2 },
  upgradeSub: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 12 },
  card: { borderRadius: 16, borderWidth: 1, marginBottom: 12, padding: 0, overflow: 'hidden' },
  cardTitle: { fontFamily: 'DMMono_400Regular', fontSize: 10, letterSpacing: 0.8, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 },
  appearanceRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingBottom: 12 },
  appearanceBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 9, borderRadius: 10 },
  appearanceBtnText: { fontFamily: 'HankenGrotesk_600SemiBold', fontSize: 13 },
  settingsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1 },
  rowLabel: { fontFamily: 'HankenGrotesk_500Medium', fontSize: 14 },
  rowValue: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 13 },
  devRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  resetBtn: { borderRadius: 12, borderWidth: 1, padding: 12, alignItems: 'center', marginBottom: 0 },
  resetText: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 12 },
  version: { textAlign: 'center', fontFamily: 'DMMono_400Regular', fontSize: 11 },
});
