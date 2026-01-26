import * as FileSystem from 'expo-file-system/legacy';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PdfViewer({ source, style }: any) {
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function readLocalFile() {
      try {
        setLoading(true);
        // قراءة الملف المحلي كـ Base64
        const base64 = await FileSystem.readAsStringAsync(source.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setBase64Data(base64);
      } catch (e) {
        console.error('Read File Error:', e);
      } finally {
        setLoading(false);
      }
    }
    if (source.uri) readLocalFile();
  }, [source.uri]);

  // كود HTML يستخدم نسخة سحابية من PDF.js لرسم الملف
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
        <style>
          body { margin: 0; background-color: #f0f0f0; display: flex; flex-direction: column; align-items: center; }
          canvas { width: 100% !important; height: auto !important; margin-bottom: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
        </style>
      </head>
      <body>
        <div id="pdf-container"></div>
        <script>
          const pdfData = atob("${base64Data}");
          const loadingTask = pdfjsLib.getDocument({data: pdfData});
          
          loadingTask.promise.then(pdf => {
            const container = document.getElementById('pdf-container');
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
              pdf.getPage(pageNum).then(page => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                const viewport = page.getViewport({scale: 1.5});
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                container.appendChild(canvas);
                page.render({canvasContext: context, viewport: viewport});
              });
            }
          }).catch(err => {
            document.body.innerHTML = "Error rendering PDF: " + err.message;
          });
        </script>
      </body>
    </html>
  `;

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  if (!base64Data)
    return (
      <View style={styles.center}>
        <Text>No PDF data</Text>
      </View>
    );

  return (
    <View style={[styles.container, style]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
