import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import { getUrl } from '../router/data';

export default function CoursePlayList() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const { data = [], isSubscribed, token }: any = route.params || {};

  const downloadPDF = async (pdfName: string) => {
    const pdfUrl = getUrl() + 'pdf/' + pdfName;
    const fileUri = (FileSystem.documentDirectory || FileSystem.cacheDirectory) + pdfName;

    try {
      // ✅ Check if already downloaded
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (fileInfo.exists && fileInfo.isDirectory === false) {
        console.log('✅ Opening already downloaded PDF:', fileInfo.uri);

        navigation.navigate('Pdf', {
          pdf: fileInfo.uri,
          token,
        });
        return;
      }

      // ✅ Not downloaded yet — fetch with HEAD first (optional but safe)
      const headRes = await fetch(pdfUrl, {
        method: 'HEAD',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!headRes.ok) {
        throw new Error('Unauthorized or file not found');
      }

      const contentType = headRes.headers.get('Content-Type');
      if (!contentType?.includes('application/pdf')) {
        throw new Error('Not a valid PDF file');
      }

      // ✅ Download the file
      setDownloadingPdf(pdfName);
      setDownloadProgress(0);

      const downloadResumable = FileSystem.createDownloadResumable(
        pdfUrl,
        fileUri,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        (progress) => {
          setDownloadProgress(progress.totalBytesWritten / progress.totalBytesExpectedToWrite);
        }
      );

      const { uri }: any = await downloadResumable.downloadAsync();

      if (uri) {
        console.log('📄 Downloaded and saved to:', uri);
        navigation.navigate('Pdf', {
          pdf: uri,
          token,
        });
      } else {
        throw new Error('Download failed');
      }
    } catch (error: any) {
      console.error('❌ Error downloading PDF:', error.message);
      alert('Failed to load PDF: ' + error.message);
    } finally {
      setDownloadingPdf(null);
      setDownloadProgress(0);
    }
  };

  const showVideo = (videoName: string) => {
    navigation.navigate('Video', {
      videoName,
      token,
    });
  };

  const ItemCard = ({ data, index }: any) => {
    const isDownloading = downloadingPdf === data.pdf;
    const progress = Math.round(downloadProgress * 100);

    return (
      <View style={styles.cardContainer}>
        <View style={{ flexDirection: 'row' }}>
          {isSubscribed || data.is_free ? (
            <>
              <TouchableWithoutFeedback onPress={() => showVideo(data.video)}>
                <Ionicons name="play" size={25} color="blue" />
              </TouchableWithoutFeedback>
              {data.pdf ? (
                <TouchableWithoutFeedback onPress={() => downloadPDF(data.pdf)}>
                  <View style={styles.downloadContainer}>
                    {isDownloading ? (
                      <View style={styles.downloadProgress}>
                        <ActivityIndicator size="small" color="red" />
                        <Text style={styles.progressText}>{progress}%</Text>
                      </View>
                    ) : (
                      <MaterialCommunityIcons
                        name="file-document"
                        size={25}
                        color="red"
                        style={{ marginHorizontal: 10 }}
                      />
                    )}
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                <></>
              )}
            </>
          ) : (
            <Ionicons name="ban" size={25} color="blue" />
          )}
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 20 }}>{data.name.slice(0, 20)}</Text>
          <Text style={styles.itemIndex}>{index + 1}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <FlatList
        data={data}
        renderItem={({ item, index }) => <ItemCard data={item} index={index} />}
        keyExtractor={(item: any) => String(item.id)}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: '#ddd',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    alignItems: 'center',
    marginHorizontal: '2%',
    borderRadius: 20,
  },
  itemIndex: {
    fontSize: 20,
    width: 30,
    backgroundColor: 'white',
    borderRadius: 100,
    marginLeft: 10,
    textAlign: 'center',
  },
  downloadContainer: {
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    marginLeft: 8,
    fontSize: 12,
    color: 'red',
    fontWeight: 'bold',
  },
});
