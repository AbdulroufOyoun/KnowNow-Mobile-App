import { useRoute } from '@react-navigation/native';
import {
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';

export default function ShowPdfScreen() {
  const route = useRoute();
  const { pdf = null, token = null } = (route.params as any) || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const openPdf = async () => {
    if (!pdf) return;
    setLoading(true);
    setError(null);

    try {
      // 1. تحديد مسار محلي للملف
      const fileName = `temp_${Date.now()}.pdf`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      // 2. تحميل الملف مع الـ Token (لحل مشكلة خطأ 400)
      const downloadRes = await FileSystem.downloadAsync(pdf, fileUri, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // 3. تحويل الرابط إلى رابط محلي آمن للأندرويد (Content URI)
      const contentUri = await FileSystem.getContentUriAsync(downloadRes.uri);

      // 4. فتح الملف مباشرة في عارض النظام (بدون قائمة مشاركة)
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: contentUri,
        flags: 1, // إذن القراءة فقط
        type: 'application/pdf',
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء فتح ملف PDF');
      setLoading(false);
    }
  };

  useEffect(() => {
    openPdf();
  }, [pdf]);

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="dark-content" />
      <View style={styles.content}>
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.text}>جاري فتح الملف...</Text>
          </View>
        )}

        {error && (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.button} onPress={openPdf}>
              <Text style={styles.buttonText}>إعادة المحاولة</Text>
            </TouchableOpacity>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  center: {
    alignItems: 'center',
  },
  text: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
