import { useRoute } from '@react-navigation/native';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useMemo } from 'react';
import Constants from 'expo-constants';
// import Pdf from 'react-native-pdf';

export default function ShowPdfScreen() {
  const route = useRoute();
  // const { pdf = null, token = null }: any = route.params || {};

  // const source = useMemo(() => {
  //   if (!pdf) return null;

  //   const isLocal = pdf.startsWith('/') || pdf.startsWith('file:');
  //   const normalized = isLocal && !pdf.startsWith('file:') ? `file://${pdf}` : pdf;

  //   return {
  //     uri: normalized,
  //     cache: true,
  //     headers: token ? { Authorization: `Bearer ${token}` } : {},
  //   };
  // }, [pdf, token]);

  // if (!source) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.msg}>⚠️ No PDF source provided.</Text>
  //     </View>
  //   );
  // }

  // return (
  //   <View style={styles.container}>
  //     <StatusBar translucent barStyle="dark-content" />
  //     <View style={{ flex: 1, paddingTop: Constants.statusBarHeight }}>
  //       <Pdf
  //         source={source as any}
  //         onLoadComplete={(pages, filePath) =>
  //           console.log(`Loaded PDF with ${pages} pages from ${filePath}`)
  //         }
  //         onError={(e) => console.log('PDF error:', e)}
  //         style={{ flex: 1 }}
  //       />
  //     </View>
  //   </View>
  // );
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

//   const [pdfSource, setPdfSource] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadPdf = async () => {
//       try {
//         if (!pdf || !token) {
//           setError('Missing PDF or token');
//           return;
//         }

//         const fileName = pdf.split('/').pop(); // Get just the file name
//         const remoteUri = `http://192.168.1.5:8888/api/pdf/${fileName}`;
//         const localPath = FileSystem.cacheDirectory + fileName;

//         console.log('Downloading PDF from:', remoteUri);
//         console.log('Saving to:', localPath);

//         const downloadResumable = FileSystem.createDownloadResumable(remoteUri, localPath, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const { uri }: any = await downloadResumable.downloadAsync();
//         if (!uri) throw new Error('Download failed');

//         // Check if file content starts with %PDF
//         const fileStart = await FileSystem.readAsStringAsync(uri, {
//           encoding: FileSystem.EncodingType.UTF8,
//         });

//         if (!fileStart.trimStart().startsWith('%PDF')) {
//           console.log('Invalid file content:', fileStart.slice(0, 100));
//           throw new Error('Downloaded file is not a valid PDF');
//         }

//         // Convert to base64 and load
//         const base64 = await FileSystem.readAsStringAsync(uri, {
//           encoding: FileSystem.EncodingType.Base64,
//         });

//         setPdfSource({
//           uri: `data:application/pdf;base64,${base64}`,
//         });
//       } catch (err: any) {
//         console.error('Error loading PDF:', err);
//         setError(err.message || 'Failed to load PDF');
//       }
//     };

//     loadPdf();
//   }, [pdf, token]);

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.msg}>⚠️ Error: {error}</Text>
//       </View>
//     );
//   }

//   if (!pdfSource) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.msg}>⏳ Loading PDF...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar translucent barStyle="dark-content" />
//       <View style={{ flex: 1, paddingTop: Constants.statusBarHeight }}>
//         <Pdf
//           source={pdfSource}
//           style={{ flex: 1 }}
//           onLoadComplete={(pages, filePath) =>
//             console.log(`✅ PDF loaded (${pages} pages) from ${filePath}`)
//           }
//           onError={(e) => {
//             console.log('❌ PDF error:', e);
//             setError('Failed to render PDF. It may be corrupted.');
//           }}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   msg: {
//     textAlign: 'center',
//     marginTop: 24,
//     color: 'gray',
//     fontSize: 16,
//   },
// });
