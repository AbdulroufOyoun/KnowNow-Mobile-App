import { useVideoPlayer, VideoView } from 'expo-video';
import {
  Text,
  Dimensions,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
} from 'react-native';
import { getUrl } from 'router/data';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
export default function ShowCourseVideo({ route }: any) {
  const { videoName = null, token = null } = route.params || {};
  const navigation = useNavigation();
  const MyStatusBar = ({ backgroundColor }: any) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <View>
        <StatusBar translucent backgroundColor={backgroundColor} barStyle="light-content" />
      </View>
    </View>
  );
  const videoSource = {
    uri: getUrl() + 'video/' + videoName,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const player = useVideoPlayer(videoSource, (player) => {
    player.play();
  });

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
            <TouchableWithoutFeedback
              onPress={() => navigation.goBack()}
              style={{ height: 60, backgroundColor: 'black', marginTop: 50 }}>
              <View style={{ flexDirection: 'row', height: 60 }}>
                <Feather name="chevron-left" size={28} color="white" />
                <Text style={{ fontSize: 20, color: 'white' }}> رجوع </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.contentContainer}>
            <VideoView
              style={styles.video}
              player={player}
              fullscreenOptions={{ enabled: true }}
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
  },
});
