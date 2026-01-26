import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import PDFReader from 'rn-pdf-reader-js';
import * as ScreenCapture from 'expo-screen-capture';
import { useRoute } from '@react-navigation/native';

export default function ShowPdfScreen() {
  const route = useRoute();
  const { pdf, token } = (route.params as any) || {};
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. تفعيل حماية الشاشة (منع تصوير الشاشة وسجل الفيديو)
    ScreenCapture.preventScreenCaptureAsync();

    // تأخير بسيط للتأكد من تحميل المكون
    const timer = setTimeout(() => setLoading(false), 1000);

    return () => {
      // 2. السماح بالتصوير مرة أخرى عند الخروج
      ScreenCapture.allowScreenCaptureAsync();
      clearTimeout(timer);
    };
  }, []);

  if (!pdf) return <Text>رابط الملف غير موجود</Text>;

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 10 }}>جاري تجهيز الملف الآمن...</Text>
        </View>
      )}

      <PDFReader
        source={{
          uri: pdf,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }}
        withScroll={true}
        withPinchZoom={true}
        // هذه المكتبة تستخدم WebView داخلي، وهي آمنة من مشكلة الـ 16KB
        onLoad={() => setLoading(false)}
        onError={(error) => console.log('PDF Error:', error)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 1,
  },
});
