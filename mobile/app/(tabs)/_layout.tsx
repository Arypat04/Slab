import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Tabs, TabList, TabTrigger, TabSlot, useTabTrigger } from 'expo-router/ui';
import { router, type Href } from 'expo-router';
import { useTheme } from '../../src/theme';
import { HomeIcon, CollectionIcon, CameraIcon, InsightsIcon, ProfileIcon } from '../../src/components/Icons';

type TabName = 'index' | 'collection' | 'insights' | 'profile';

interface TabItemProps {
  name: TabName;
  href: Href;
  label: string;
  icon: React.ComponentType<{ color: string; size?: number }>;
}

function TabItem({ name, href, label, icon: Icon }: TabItemProps) {
  const t = useTheme();
  const { trigger, triggerProps } = useTabTrigger({ name, href });
  const active = trigger?.isFocused ?? false;

  return (
    <Pressable {...triggerProps} style={styles.tabItem}>
      <Icon color={active ? t.accent : t.muted} size={22} />
      <Text style={[styles.tabLabel, { color: active ? t.accent : t.muted }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function ScanFab() {
  const t = useTheme();
  return (
    <Pressable onPress={() => router.push('/scan')} style={[styles.fab, { backgroundColor: t.accent }]}>
      <CameraIcon color={t.accentInk} size={22} />
    </Pressable>
  );
}

export default function TabsLayout() {
  const t = useTheme();

  return (
    <Tabs>
      {/* Hidden tab list — defines the routes */}
      <TabList style={{ display: 'none' }}>
        <TabTrigger name="index" href="/(tabs)" />
        <TabTrigger name="collection" href="/(tabs)/collection" />
        <TabTrigger name="insights" href="/(tabs)/insights" />
        <TabTrigger name="profile" href="/(tabs)/profile" />
      </TabList>

      {/* Screen content */}
      <TabSlot style={{ flex: 1 }} />

      {/* Custom tab bar */}
      <View style={[styles.tabBar, { backgroundColor: t.footer, borderTopColor: t.line }]}>
        <TabItem name="index" href="/(tabs)" label="Home" icon={HomeIcon} />
        <TabItem name="collection" href="/(tabs)/collection" label="Collection" icon={CollectionIcon} />
        <ScanFab />
        <TabItem name="insights" href="/(tabs)/insights" label="Insights" icon={InsightsIcon} />
        <TabItem name="profile" href="/(tabs)/profile" label="Profile" icon={ProfileIcon} />
      </View>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingBottom: 26,
    paddingTop: 8,
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  tabLabel: {
    fontFamily: 'HankenGrotesk_500Medium',
    fontSize: 10,
  },
  fab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    shadowColor: '#00c2a8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
});
