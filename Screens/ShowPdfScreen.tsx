import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';
import { useRoute } from '@react-navigation/native';
import PdfViewer from 'Components/PdfViewer';
// import PdfViewer from './PdfViewer'; // هنا نستدعي الكود الذي وضعته أنت في الملف

export default function ShowPdfScreen() {
  const route = useRoute();
  const { pdf, token } = (route.params as any) || {};

  useEffect(() => {
    // منع تصوير الشاشة
    console.log('PDF to show:', pdf);

    ScreenCapture.preventScreenCaptureAsync();
    return () => {
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);

  if (!pdf) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* هنا نستخدم المكون الخاص بك ونمرر له البيانات */}
      <PdfViewer
        source={{
          uri: pdf,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }}
        style={styles.viewer}
        // ملاحظة: الكود الخاص بك فيه خيارات مثل useGoogleReader
        // إذا كان الملف خاصاً (يتطلب توكن)، لا تفعل هذه الخيارات
        useGoogleReader={false}
        useGoogleDriveViewer={false}
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
