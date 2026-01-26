import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';
import { useRoute } from '@react-navigation/native';
import PdfViewer from 'react-native-webview'; // تأكد من المسار الصحيح للملف الذي أنشأته

export default function ShowPdfScreen() {
  const route = useRoute();
  const { pdf, token } = (route.params as any) || {};

  useEffect(() => {
    // 1. تفعيل حماية الشاشة (منع السكرين شوت والتسجيل)
    ScreenCapture.preventScreenCaptureAsync();

    return () => {
      // 2. إلغاء الحماية عند الخروج
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);

  if (!pdf) return null;

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="dark-content" />

      {/* استخدام المحرك الاحترافي الذي أرسلته */}
      <PdfViewer
        source={{
          uri: pdf,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }}
        style={styles.viewer}
        // الخيارات التالية تضمن العرض داخلياً دون الحاجة لروابط جوجل
        // مما يحافظ على الأمان ويدعم التوكن
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewer: {
    flex: 1,
  },
});
