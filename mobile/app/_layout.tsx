import { useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
  HankenGrotesk_800ExtraBold,
} from '@expo-google-fonts/hanken-grotesk';
import { DMMono_400Regular, DMMono_500Medium } from '@expo-google-fonts/dm-mono';
import * as SplashScreen from 'expo-splash-screen';
import { useAppStore } from '../src/store/useAppStore';
import { DARK, LIGHT, ThemeContext } from '../src/theme';
import { requestNotificationPermissions, scheduleLocalNotification } from '../src/services/notifications';
import { initPurchases } from '../src/services/purchases';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useAppStore((s) => s.theme);
  const t = theme === 'dark' ? DARK : LIGHT;
  const initDone = useRef(false);

  const [fontsLoaded] = useFonts({
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
    HankenGrotesk_800ExtraBold,
    DMMono_400Regular,
    DMMono_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;
    const run = async () => {
      await initPurchases((isPro) => {
        useAppStore.getState().setTier(isPro ? 'pro' : 'free');
      });
      await requestNotificationPermissions();
      // Check price alerts against current card values
      const { collection, priceAlerts, setPriceAlert } = useAppStore.getState();
      for (const [cardId, target] of Object.entries(priceAlerts)) {
        const card = collection.find((c) => c.id === cardId);
        if (card && card.value >= target) {
          await scheduleLocalNotification(
            `Price Alert: ${card.name}`,
            `${card.name} has reached your $${target} target!`,
          );
          setPriceAlert(cardId, null);
        }
      }
    };
    run();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeContext.Provider value={t}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ animation: 'none' }} />
          <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
          <Stack.Screen name="paywall" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen
            name="scan"
            options={{ animation: 'slide_from_bottom', presentation: 'fullScreenModal' }}
          />
          <Stack.Screen name="analysis" options={{ animation: 'fade' }} />
          <Stack.Screen name="grade" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="roi" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="detail" options={{ animation: 'slide_from_right' }} />
        </Stack>
      </ThemeContext.Provider>
    </GestureHandlerRootView>
  );
}
