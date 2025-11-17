import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Platform,
} from 'react-native';
import { showCollections, showCourses, showUniversities, updateFcmToken } from '../router/data';
import CollectionList from '../Components/CollectionList';
import CourseCard from '../Components/CourseCard';
import Loading from '../Components/loading';
import { useNavigation } from '@react-navigation/native';
import UniversitiesCard from 'Components/UniversitiesCard';
import TopAdsComponent from '../Components/AdsComponents';

const currentDate = new Date();
const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

export default function HomeScreen() {
  const [collections, setCollections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
  const [universities, setUniversities] = useState<any>([]);

  const requestUserPermission = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  };

  const setupNotifications = async () => {
    try {
      const permissionGranted = await requestUserPermission();
      if (!permissionGranted) {
        console.log('Notification permission not granted');
        return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#3F83BF',
        });
      }

      const devicePushToken = await Notifications.getDevicePushTokenAsync();
      console.log('Device Push Token (full object):', JSON.stringify(devicePushToken, null, 2));

      let fcmToken: string;
      if (typeof devicePushToken === 'string') {
        fcmToken = devicePushToken;
      } else if (devicePushToken && typeof devicePushToken === 'object') {
        if (devicePushToken.data && typeof devicePushToken.data === 'string') {
          fcmToken = devicePushToken.data;
          if (fcmToken.startsWith('ExponentPushToken')) {
            console.warn(
              'Received Expo Push Token instead of FCM token. Backend needs to use Expo Push API.'
            );
          }
        } else {
          console.error('Invalid token structure - data is not a string:', devicePushToken);
          return;
        }
      } else {
        console.error('Invalid token structure:', devicePushToken);
        return;
      }

      console.log('FCM Token extracted:', fcmToken);
      console.log('Token length:', fcmToken.length);
      console.log('Token starts with:', fcmToken.substring(0, 20));

      if (!fcmToken || fcmToken.trim() === '') {
        console.error('FCM token is empty');
        return;
      }

      if (!token) {
        console.error('User token is not available');
        return;
      }
      const response = await updateFcmToken(token, fcmToken);
      console.log('FCM Token update response:', response.data);

      if (response.data) {
        console.log('Token successfully sent to backend');
      }

      Notifications.addNotificationReceivedListener((notification) => {
        Alert.alert('📩 إشعار جديد', notification.request.content.body || 'وصل إشعار جديد');
      });
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification tapped:', response);
      });
    } catch (error: any) {
      console.error('Notification setup error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };
  useEffect(() => {
    if (!token) {
      getUserData();
    }
    if (token) {
      getUniversities();
      getCollections();
      setupNotifications();
    }
  }, [token]);
  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        if (parsed.token != null && parsed.token_expire_at > formattedDate) {
          setToken(parsed.token);
        }
      }
    } catch {
      navigation.navigate('Login');
    }
  };

  const getUniversities = () => {
    showUniversities()
      .then((response) => {
        setUniversities(response.data.data);
      })
      .catch((error: any) => {
        console.log(error.message);
      });
  };

  const getCollections = () => {
    if (collections.length === 0) {
      showCollections(token)
        .then((response) => {
          setCollections(response.data.data);
          getCourses();
          setLoading(false);
        })
        .catch((error: any) => {
          console.log('collection error:', error.message);
        });
    }
  };

  const getCourses = () => {
    if (courses.length === 0) {
      showCourses(token)
        .then((response) => {
          setCourses(response.data.data);
        })
        .catch(() => {});
    }
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#035AA6" />
      <View style={styles.adsContainer}>
        <TopAdsComponent />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Loading />
        </View>
      ) : (
        <>
          <View style={styles.universitiesSection}>
            <FlatList
              data={universities}
              renderItem={({ item }) => (
                <UniversitiesCard
                  name={item.name}
                  id={item.id}
                  navigation={navigation}
                  token={token}
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              inverted
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.universitiesList}
            />
          </View>
          {collections.length <= 0 ? (
            <></>
          ) : (
            <View>
              <View style={styles.discountTitle}>
                <TouchableWithoutFeedback
                  onPress={() => navigation.navigate('AllCollections', { token })}>
                  <Text style={styles.seeAllText}>عرض الكل</Text>
                </TouchableWithoutFeedback>
                <Text style={styles.collectionTitle}>العروض</Text>
              </View>
              <FlatList
                data={collections}
                renderItem={({ item }) => <CollectionList data={item} token={token} />}
                keyExtractor={(item: any) => item.id}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                inverted={true}
              />
            </View>
          )}
          <View style={styles.popularSection}>
            <Text style={styles.popularTitle}>شائع الان</Text>
            <FlatList
              data={courses}
              renderItem={({ item }) => <CourseCard data={item} />}
              keyExtractor={(item: any) => item.id}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  adsContainer: {
    backgroundColor: '#ACCAF2',
    paddingTop: 8,
  },
  loadingContainer: {
    backgroundColor: '#F5F7FA',
    flex: 1,
    minHeight: 400,
  },
  universitiesSection: {
    backgroundColor: '#F5F7FA',
  },
  universitiesList: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  discountTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bold',
    backgroundColor: '#ACCAF2',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: '5%',
    marginBottom: 10,
    marginTop: 8,
    shadowColor: '#035AA6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  seeAllText: {
    fontSize: 16,
    color: '#035AA6',
    marginTop: 3,
    fontWeight: '600',
  },
  collectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#035AA6',
  },
  popularSection: {
    backgroundColor: '#F5F7FA',
    paddingTop: 8,
  },
  popularTitle: {
    textAlign: 'right',
    marginRight: 15,
    marginBottom: 20,
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#035AA6',
  },
  separator: {
    height: 10,
  },
});
