import { useVideoPlayer, VideoView } from 'expo-video';
import {
  Text,
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { getUrl } from 'router/data';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
export default function ShowCourseVideo({ route }: any) {
  const { videoName = null, token = null } = route.params || {};
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const MyStatusBar = ({ backgroundColor }: any) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <View>
        <StatusBar translucent backgroundColor={backgroundColor} barStyle="light-content" />
      </View>
    </View>
  );
  const videoSource = {
    uri: getUrl() + 'video/' + videoName,
    type: 'hls',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const player = useVideoPlayer(videoSource, (player) => {
    player.play();
  });

  useEffect(() => {
    console.log(videoSource);
    const subscription = player.addListener('statusChange', (status) => {
      if (status.status === 'readyToPlay') {
        setLoading(false);
      } else if (status.status === 'error') {
        console.log('Error loading video', status.error);
        setLoading(false);
      }
    });
    console.log('Video Source:', videoSource);
    return () => {
      subscription.remove();
    };
  }, [player]);

  return (
    <>
      {isTablet ? (
        <View>
          <Text>This app is not designed for tablets.</Text>
        </View>
      ) : (
        <View style={{ backgroundColor: 'black', flex: 1 }}>
          <MyStatusBar backgroundColor="#474747" />
          <View style={styles.appBar}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              style={styles.backButton}>
              <Feather name="chevron-left" size={28} color="white" />
              <Text style={styles.backText}> رجوع </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentContainer}>
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.loadingText}>جاري تحميل الفيديو...</Text>
              </View>
            )}
            <VideoView
              style={styles.video}
              player={player}
              fullscreenOptions={{ enable: true }}
              allowsPictureInPicture
            />
          </View>
        </View>
      )}
    </>
  );
}
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? StatusBar.currentHeight : 0;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: 275,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    marginTop: APPBAR_HEIGHT,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 20,
    color: 'white',
    marginLeft: 8,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
});
