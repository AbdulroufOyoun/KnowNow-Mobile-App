import { useRoute } from '@react-navigation/native';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export default function ShowPdfScreen() {
  const route = useRoute();
  const { pdf = null, token = null }: any = route.params || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenPdf = async () => {
    if (!pdf) return;

    setLoading(true);
    setError(null);

    try {
      // 1. تحديد مسار التخزين المؤقت
      const fileName = pdf.split('/').pop() || 'document.pdf';
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      // 2. تحميل الملف مع الـ Token
      const downloadRes = await FileSystem.downloadAsync(pdf, fileUri, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // 3. فتح الملف باستخدام تطبيق النظام
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadRes.uri);
      } else {
        setError('⚠️ Sharing is not available on this device');
      }
    } catch (err) {
      setError('⚠️ Failed to load PDF');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // محاولة فتح الملف تلقائياً عند الدخول للصفحة
  useEffect(() => {
    handleOpenPdf();
  }, [pdf]);

  if (!pdf) {
    return (
      <View style={styles.container}>
        <Text style={styles.msg}>⚠️ No PDF source provided.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="dark-content" />
      <View style={styles.content}>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        {error && <Text style={styles.msg}>{error}</Text>}

        {!loading && (
          <TouchableOpacity style={styles.button} onPress={handleOpenPdf}>
            <Text style={styles.buttonText}>إعادة فتح الملف 📄</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  msg: {
    textAlign: 'center',
    color: 'red',
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
