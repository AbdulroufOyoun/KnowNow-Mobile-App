import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useEffect, useState, useCallback } from 'react';
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
  RefreshControl,
} from 'react-native';
import { showCollections, showCourses, showUniversities, updateFcmToken } from '../router/data';
import CollectionList from '../Components/CollectionList';
import CourseCard from '../Components/CourseCard';
import { HomeScreenSkeleton } from '../Components/SkeletonLoader';
import { useNavigation } from '@react-navigation/native';
import UniversitiesCard from 'Components/UniversitiesCard';
import TopAdsComponent from '../Components/TopAdsComponent';
import { showErrorAlert, logError } from '../utils/errorHandler';
import { useNetworkState, NetworkBanner } from '../utils/networkUtils';

const currentDate = new Date();
const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

export default function HomeScreen() {
  const [collections, setCollections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();
  const [universities, setUniversities] = useState<any>([]);
  const { isConnected } = useNetworkState();

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

      let fcmToken: string;
      if (typeof devicePushToken === 'string') {
        fcmToken = devicePushToken;
      } else if (devicePushToken && typeof devicePushToken === 'object') {
        if (devicePushToken.data && typeof devicePushToken.data === 'string') {
          fcmToken = devicePushToken.data;
        } else {
          return;
        }
      } else {
        return;
      }

      if (!fcmToken || fcmToken.trim() === '') {
        return;
      }

      if (!token) {
        return;
      }
      const response = await updateFcmToken(token, fcmToken);

      Notifications.addNotificationReceivedListener((notification) => {
        Alert.alert('📩 إشعار جديد', notification.request.content.body || 'وصل إشعار جديد');
      });
      Notifications.addNotificationResponseReceivedListener(() => {
        // Notification tapped
      });
    } catch (error: any) {
      // Notification setup error
      if (error.response) {
        // Error response
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
      // setupNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const getUniversities = useCallback(() => {
    showUniversities()
      .then((response) => {
        setUniversities(response.data.data);
      })
      .catch((error: any) => {
        logError(error, 'getUniversities');
        if (__DEV__) {
          showErrorAlert(error, 'خطأ في تحميل الجامعات');
        }
      });
  }, []);

  const getCourses = useCallback(() => {
    if (!token) return;
    showCourses(token)
      .then((response) => {
        setCourses(response.data.data);
      })
      .catch((error: any) => {
        logError(error, 'getCourses');
        if (__DEV__) {
          showErrorAlert(error, 'خطأ في تحميل الدورات');
        }
      });
  }, [token]);

  const getCollections = useCallback(() => {
    if (!token) return;
    showCollections(token, 1, 3)
      .then((response) => {
        setCollections(response.data.data);
        console.log(response.data.data);
        getCourses();
        setLoading(false);
      })
      .catch((error: any) => {
        logError(error, 'getCollections');
        console.log('error is ' + error.message);
        setLoading(false);
        if (__DEV__) {
          showErrorAlert(error, 'خطأ في تحميل العروض');
        }
      });
  }, [token, getCourses]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (token) {
      Promise.all([getUniversities(), getCollections(), getCourses()])
        .then(() => {
          setRefreshing(false);
        })
        .catch(() => {
          setRefreshing(false);
        });
    } else {
      setRefreshing(false);
    }
  }, [token, getUniversities, getCollections, getCourses]);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#035AA6" />
      <NetworkBanner isConnected={isConnected} />
      <View style={styles.adsContainer}>
        <TopAdsComponent />
      </View>
      {loading ? (
        <HomeScreenSkeleton />
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
              keyExtractor={(item) => String(item.id)}
              horizontal
              inverted
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.universitiesList}
              removeClippedSubviews={true}
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
                keyExtractor={(item: any) => String(item.id)}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                inverted={true}
                removeClippedSubviews={true}
              />
            </View>
          )}
          <View style={styles.popularSection}>
            <Text style={styles.popularTitle}>شائع الان</Text>
            <FlatList
              data={courses}
              renderItem={({ item }) => <CourseCard data={item} />}
              keyExtractor={(item: any) => String(item.id)}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              removeClippedSubviews={true}
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
    backgroundColor: '#3F83BF',
    paddingTop: 8,
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
    backgroundColor: '#3F83BF',
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
    color: '#ffffff',
    marginTop: 3,
    fontWeight: '600',
  },
  collectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
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
