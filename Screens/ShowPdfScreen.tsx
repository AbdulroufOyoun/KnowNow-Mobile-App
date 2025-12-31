import { useRoute } from '@react-navigation/native';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useMemo } from 'react';
import Constants from 'expo-constants';
import Pdf from 'react-native-pdf';

export default function ShowPdfScreen() {
  const route = useRoute();
  const { pdf = null, token = null }: any = route.params || {};

  const source = useMemo(() => {
    if (!pdf) return null;

    const isLocal = pdf.startsWith('/') || pdf.startsWith('file:');
    const normalized = isLocal && !pdf.startsWith('file:') ? `file://${pdf}` : pdf;

    return {
      uri: normalized,
      cache: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
  }, [pdf, token]);

  if (!source) {
    return (
      <View style={styles.container}>
        <Text style={styles.msg}>⚠️ No PDF source provided.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="dark-content" />
      <View style={{ flex: 1, paddingTop: Constants.statusBarHeight }}>
        <Pdf
          source={source as any}
          onLoadComplete={() => {
            // PDF loaded successfully
          }}
          onError={() => {
            // PDF error
          }}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  msg: {
    textAlign: 'center',
    marginTop: 24,
    color: 'gray',
  },
});
