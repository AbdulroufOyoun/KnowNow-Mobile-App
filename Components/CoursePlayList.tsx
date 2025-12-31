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
        navigation.navigate('Pdf', {
          pdf: uri,
          token,
        });
      } else {
        throw new Error('Download failed');
      }
    } catch (error: any) {
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
        <View style={styles.actionsContainer}>
          {isSubscribed || data.is_free ? (
            <>
              <TouchableWithoutFeedback onPress={() => showVideo(data.video)}>
                <View style={styles.iconButton}>
                  <Ionicons name="play" size={22} color="#035AA6" />
                </View>
              </TouchableWithoutFeedback>
              {data.pdf ? (
                <TouchableWithoutFeedback onPress={() => downloadPDF(data.pdf)}>
                  <View style={styles.downloadContainer}>
                    {isDownloading ? (
                      <View style={styles.downloadProgress}>
                        <ActivityIndicator size="small" color="#035AA6" />
                        <Text style={styles.progressText}>{progress}%</Text>
                      </View>
                    ) : (
                      <MaterialCommunityIcons
                        name="file-document"
                        size={22}
                        color="red"
                        style={styles.documentIcon}
                      />
                    )}
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                <></>
              )}
            </>
          ) : (
            <View style={styles.iconButton}>
              <Ionicons name="lock-closed" size={22} color="#8593A6" />
            </View>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
            {data.name}
          </Text>
          <View style={styles.indexContainer}>
            <Text style={styles.itemIndex}>{index + 1}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item, index }) => <ItemCard data={item} index={index} />}
        keyExtractor={(item: any) => String(item.id)}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingTop: 16,
  },
  listContent: {
    paddingBottom: 30,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    minHeight: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#035AA6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 3,
    borderLeftColor: '#3F83BF',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  iconButton: {
    padding: 6,
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    color: '#035AA6',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    marginRight: 12,
  },
  indexContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ACCAF2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIndex: {
    fontSize: 16,
    color: '#035AA6',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  downloadContainer: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentIcon: {
    marginHorizontal: 4,
  },
  downloadProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#035AA6',
    fontWeight: 'bold',
  },
  separator: {
    height: 12,
  },
});
