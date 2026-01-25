import { useRoute } from '@react-navigation/native';
import { StatusBar, StyleSheet, View, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';

export default function ShowPdfScreen() {
  const route = useRoute();
  const { pdf = null } = (route.params as any) || {};
  const [loading, setLoading] = useState(true);

  if (!pdf) return null;

  // استخدام Google Docs Viewer لعرض الملف داخل WebView
  // هذا يضمن عرض الملف دون الحاجة لمكتبات PDF ثقيلة
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdf)}&embedded=true`;

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="dark-content" />
      <View style={{ flex: 1, paddingTop: Constants.statusBarHeight }}>
        <WebView
          source={{ uri: viewerUrl }}
          onLoadEnd={() => setLoading(false)}
          style={styles.webview}
          // منع التنقل خارج الصفحة
          onNavigationStateChange={(navState: any) => {
            if (!navState.url.includes('google.com/viewer')) {
              return false;
            }
          }}
        />

        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
