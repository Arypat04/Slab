import React, { useRef, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, SafeAreaView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useTheme } from '../src/theme';
import { useAppStore } from '../src/store/useAppStore';
import { FlashIcon, GalleryIcon } from '../src/components/Icons';
import * as ImagePicker from 'expo-image-picker';

export default function Scan() {
  const t = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<'front' | 'both'>('front');
  const [flash, setFlash] = useState(false);
  const [frontUri, setFrontUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const setCapturedImageUri = useAppStore((s) => s.setCapturedImageUri);
  const setCapturedBackImageUri = useAppStore((s) => s.setCapturedBackImageUri);
  const tier = useAppStore((s) => s.tier);
  const scanCount = useAppStore((s) => s.scanCount);
  const scanCountMonth = useAppStore((s) => s.scanCountMonth);
  const incrementScanCount = useAppStore((s) => s.incrementScanCount);

  const waitingForBack = mode === 'both' && frontUri !== null;

  const startAnalysis = async (front: string, back?: string) => {
    // Gate free tier at 10 scans/month
    const currentMonth = new Date().toISOString().slice(0, 7);
    const effectiveCount = scanCountMonth === currentMonth ? scanCount : 0;
    if (tier === 'free' && effectiveCount >= 10) {
      try {
        const { PAYWALL_RESULT } = await import('react-native-purchases-ui');
        const RevenueCatUI = (await import('react-native-purchases-ui')).default;
        const result = await RevenueCatUI.presentPaywallIfNeeded({
          requiredEntitlementIdentifier: 'Slab Pro',
        });
        if (result !== PAYWALL_RESULT.PURCHASED && result !== PAYWALL_RESULT.RESTORED) {
          return; // user cancelled or already has entitlement check failed
        }
        // fall through to scan if they just purchased
      } catch {
        router.push('/paywall'); // fallback for Expo Go
        return;
      }
    }
    incrementScanCount();
    setCapturedImageUri(front);
    setCapturedBackImageUri(back ?? null);
    router.push('/analysis');
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    if (!photo?.uri) return;

    if (mode === 'both' && !frontUri) {
      setFrontUri(photo.uri);
    } else if (mode === 'both' && frontUri) {
      startAnalysis(frontUri, photo.uri);
      setFrontUri(null);
    } else {
      startAnalysis(photo.uri);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });
    if (result.canceled || !result.assets[0]) return;
    const uri = result.assets[0].uri;

    if (mode === 'both' && !frontUri) {
      setFrontUri(uri);
    } else if (mode === 'both' && frontUri) {
      startAnalysis(frontUri, uri);
      setFrontUri(null);
    } else {
      startAnalysis(uri);
    }
  };

  const resetFront = () => setFrontUri(null);

  if (!permission) return <View style={{ flex: 1, backgroundColor: '#0d1b17' }} />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.permSafe, { backgroundColor: t.bg }]}>
        <Text style={[styles.permTitle, { color: t.ink }]}>Camera Access Needed</Text>
        <Text style={[styles.permBody, { color: t.muted2 }]}>
          Slab needs the camera to photograph your cards for AI grading.
        </Text>
        <Pressable onPress={requestPermission} style={styles.permBtn}>
          <Text style={styles.permBtnText}>Grant Access</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginTop: 12 }}>
          <Text style={[styles.permBack, { color: t.muted }]}>Cancel</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        flash={flash ? 'on' : 'off'}
      />

      <SafeAreaView style={styles.overlay}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable
            onPress={() => { resetFront(); router.back(); }}
            style={styles.circleBtn}
            hitSlop={8}
          >
            <Text style={styles.circleBtnText}>✕</Text>
          </Pressable>

          <View style={styles.segmented}>
            <Pressable
              onPress={() => { setMode('front'); setFrontUri(null); }}
              style={[styles.seg, mode === 'front' && styles.segActive]}
            >
              <Text style={[styles.segText, mode === 'front' ? styles.segTextActive : styles.segTextInactive]}>
                Front Only
              </Text>
            </Pressable>
            <Pressable
              onPress={() => { setMode('both'); setFrontUri(null); }}
              style={[styles.seg, mode === 'both' && styles.segActive]}
            >
              <Text style={[styles.segText, mode === 'both' ? styles.segTextActive : styles.segTextInactive]}>
                Front &amp; Back
              </Text>
            </Pressable>
          </View>

          <Pressable onPress={() => setFlash(!flash)} style={styles.circleBtn} hitSlop={8}>
            <FlashIcon size={17} />
          </Pressable>
        </View>

        {/* Frame */}
        <View style={styles.frameWrap}>
          <View style={styles.frame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            <Text style={styles.frameLabel}>
              {waitingForBack ? 'BACK OF CARD' : 'RAW CARD / PSA LABEL'}
            </Text>
          </View>

          {/* Step indicator for front & back */}
          {mode === 'both' && (
            <View style={styles.stepRow}>
              <View style={[styles.stepDot, frontUri ? styles.stepDotDone : styles.stepDotActive]}>
                <Text style={styles.stepDotText}>1</Text>
              </View>
              <View style={[styles.stepLine, frontUri && styles.stepLineDone]} />
              <View style={[styles.stepDot, waitingForBack ? styles.stepDotActive : styles.stepDotPending]}>
                <Text style={styles.stepDotText}>2</Text>
              </View>
              <Text style={styles.stepLabel}>
                {waitingForBack ? 'Flip card — shoot the back' : 'Shoot the front first'}
              </Text>
            </View>
          )}

          {!waitingForBack && (
            <View style={styles.alignedPill}>
              <View style={styles.alignedDot} />
              <Text style={styles.alignedText}>Aligned — hold steady</Text>
            </View>
          )}

          {/* Retake front button when waiting for back */}
          {waitingForBack && (
            <Pressable onPress={resetFront} style={styles.retakePill}>
              <Text style={styles.retakeText}>↩ Retake front</Text>
            </Pressable>
          )}
        </View>

        {/* Hint */}
        <Text style={styles.hint}>
          {waitingForBack ? 'Now photograph the back of the card' : 'Align your card within the frame'}
        </Text>

        {/* Controls */}
        <View style={styles.controls}>
          <Pressable style={styles.zoomBtn}>
            <Text style={styles.zoomText}>.5×</Text>
          </Pressable>

          <Pressable onPress={takePicture} style={[styles.shutterRing, waitingForBack && styles.shutterRingBack]}>
            <View style={styles.shutterInner} />
          </Pressable>

          <Pressable onPress={pickFromGallery} style={styles.galleryBtn}>
            <GalleryIcon color="#ffffff" size={20} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d1b17' },
  overlay: { flex: 1 },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 2,
  },
  circleBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(241,244,243,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  circleBtnText: { color: '#fff', fontSize: 17 },
  segmented: {
    flexDirection: 'row', backgroundColor: 'rgba(241,244,243,0.15)', borderRadius: 100, padding: 4,
  },
  seg: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100 },
  segActive: { backgroundColor: '#00c2a8' },
  segText: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 13 },
  segTextActive: { color: '#04332c' },
  segTextInactive: { color: 'rgba(255,255,255,0.7)' },
  frameWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  frame: {
    width: 248, height: 344, borderRadius: 18,
    backgroundColor: 'rgba(26,38,35,0.6)', borderWidth: 1, borderColor: 'rgba(44,58,54,0.8)',
    justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 14,
  },
  corner: { position: 'absolute', width: 34, height: 34, borderColor: '#00c2a8', borderRadius: 2 },
  cornerTL: { top: -3, left: -3, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 14 },
  cornerTR: { top: -3, right: -3, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 14 },
  cornerBL: { bottom: -3, left: -3, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 14 },
  cornerBR: { bottom: -3, right: -3, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 14 },
  frameLabel: { fontFamily: 'DMMono_400Regular', fontSize: 10, color: '#6f827b' },
  stepRow: {
    position: 'absolute', bottom: -44, flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  stepDot: {
    width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  stepDotActive: { backgroundColor: '#00c2a8' },
  stepDotDone: { backgroundColor: '#18b368' },
  stepDotPending: { backgroundColor: 'rgba(255,255,255,0.15)' },
  stepDotText: { color: '#fff', fontFamily: 'HankenGrotesk_700Bold', fontSize: 11 },
  stepLine: { width: 20, height: 2, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 1 },
  stepLineDone: { backgroundColor: '#18b368' },
  stepLabel: { fontFamily: 'HankenGrotesk_500Medium', fontSize: 12, color: 'rgba(255,255,255,0.7)', marginLeft: 4 },
  alignedPill: {
    position: 'absolute', bottom: 24, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(24,179,104,0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100,
  },
  alignedDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#5ee49f' },
  alignedText: { fontFamily: 'HankenGrotesk_600SemiBold', fontSize: 13, color: '#5ee49f' },
  retakePill: {
    position: 'absolute', bottom: 24, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100,
    backgroundColor: 'rgba(241,244,243,0.15)',
  },
  retakeText: { fontFamily: 'HankenGrotesk_600SemiBold', fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  hint: { textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.6)', fontFamily: 'HankenGrotesk_500Medium', paddingBottom: 4 },
  controls: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 40, paddingBottom: 30, paddingTop: 14,
  },
  zoomBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(241,244,243,0.15)', alignItems: 'center', justifyContent: 'center' },
  zoomText: { color: '#fff', fontSize: 13, fontFamily: 'HankenGrotesk_700Bold' },
  shutterRing: { width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: '#fff', padding: 4 },
  shutterRingBack: { borderColor: '#00c2a8' },
  shutterInner: { flex: 1, borderRadius: 34, backgroundColor: '#00c2a8' },
  galleryBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(241,244,243,0.15)', alignItems: 'center', justifyContent: 'center' },
  permSafe: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  permTitle: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 24, marginBottom: 12, textAlign: 'center' },
  permBody: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 15, lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  permBtn: { backgroundColor: '#00c2a8', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 14 },
  permBtnText: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 16, color: '#04332c' },
  permBack: { fontSize: 14, fontFamily: 'HankenGrotesk_600SemiBold' },
});
