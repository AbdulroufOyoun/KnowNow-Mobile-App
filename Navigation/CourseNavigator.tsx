import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CoursePlayList from '../Components/CoursePlayList';
import {
  Text,
  View,
  Platform,
  StatusBar,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { coursesContain, showAboutCourse } from '../router/data';
import Loading from '../Components/loading';
import SubscribeComponent from '../Components/SubscibeComponent';
import AboutCourseScreen from '../Screens/AboutCourseScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
const Tab = createMaterialTopTabNavigator();
const screenHeigh = Dimensions.get('window').height;

const MyStatusBar = ({ backgroundColor }: any) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <View>
      <StatusBar translucent backgroundColor={backgroundColor} barStyle="light-content" />
    </View>
  </View>
);

export default function CourseNavigator() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [contain, setContain] = useState<any>({});
  const [about, setAbout] = useState<any[]>([]);
  const route = useRoute();
  const { data = null, item = null } = (route as any).params || {};
  const navigation = useNavigation();
  useEffect(() => {
    getUser();
  }, [token]);

  const getUser = async () => {
    const userData = await AsyncStorage.getItem('user');
    const parsed = userData ? JSON.parse(userData) : null;
    const userToken: string | null = parsed?.token ?? null;
    if (userToken && data) {
      getContains(userToken);
    }
    setToken(userToken);
  };

  const getContains = (userToken: string) => {
    // if (contain.length === 0) {
    coursesContain(userToken, data)
      .then((response: any) => {
        setContain(response.data.data);
        // console.log(response.data.);
      })
      .catch((error: any) => {
        console.log(error);
      });
    // }
    // if (about.length === 0) {
    showAboutCourse(userToken, data)
      .then((response: any) => {
        setAbout(response.data.data);
        setLoading(false);
      })
      .catch((error: any) => {
        console.log(error.message);
      });
    // }
  };

  return (
    <View style={styles.container}>
      <MyStatusBar backgroundColor="#035AA6" />
      <ImageBackground
        source={{ uri: item?.image || '' }} // safe guard
        style={styles.background}>
        <View style={styles.overlay}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.contentWrapper}>
              <TouchableWithoutFeedback
                onPress={() => navigation.goBack()}
                style={styles.backButtonContainer}>
                <View style={styles.backButton}>
                  <Feather name="chevron-left" size={24} color="white" />
                  <Text style={styles.backText}> رجوع </Text>
                </View>
              </TouchableWithoutFeedback>

              <View style={styles.courseInfo}>
                <Text style={styles.universityText}>{item?.university || ''}</Text>
                <Text style={styles.courseName}>{item?.name || ''}</Text>
                <Text style={styles.doctorText}>{item?.doctor}</Text>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </ImageBackground>
      <View style={styles.tabContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Loading />
          </View>
        ) : (
          <Tab.Navigator
            initialRouteName="AboutCourse"
            style={styles.tabNavigator}
            screenOptions={{
              tabBarLabelStyle: {
                fontSize: 15,
                fontWeight: '600',
                textAlign: 'right',
                writingDirection: 'rtl',
              },
              tabBarIndicatorStyle: { backgroundColor: '#3F83BF', height: 3 },
              tabBarActiveTintColor: '#035AA6',
              tabBarInactiveTintColor: '#8593A6',
              tabBarStyle: {
                backgroundColor: '#FFFFFF',
                elevation: 2,
                shadowColor: '#035AA6',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              },
            }}>
            <Tab.Screen
              name="Subscribe"
              options={{ tabBarLabel: 'اشتراك' }}
              initialParams={{ courseId: data, contain: contain, token: token }}>
              {(props: any) => <SubscribeComponent {...props} />}
            </Tab.Screen>
            {contain && (
              <>
                {contain.practical &&
                  Array.isArray(contain.practical) &&
                  contain.practical.length > 0 && (
                    <Tab.Screen
                      name="CoursePlay"
                      options={{ tabBarLabel: 'عملي' }}
                      initialParams={{
                        data: contain.practical,
                        isSubscribed: contain?.is_subscribed,
                        token: token,
                      }}
                      component={CoursePlayList}
                    />
                  )}
                {contain.theoretical &&
                  Array.isArray(contain.theoretical) &&
                  contain.theoretical.length > 0 && (
                    <Tab.Screen
                      name="CourseLicture"
                      options={{ tabBarLabel: 'نظري' }}
                      initialParams={{
                        data: contain.theoretical,
                        isSubscribed: contain?.is_subscribed || false,
                        token: token,
                      }}
                      component={CoursePlayList}
                    />
                  )}
              </>
            )}
            <Tab.Screen
              name="AboutCourse"
              options={{ tabBarLabel: 'عن الدورة' }}
              initialParams={{
                data: about || [],
              }}
              component={AboutCourseScreen}
            />
          </Tab.Navigator>
        )}
      </View>
    </View>
  );
}

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? StatusBar.currentHeight : 0;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
  background: {
    height: screenHeigh * 0.3,
    resizeMode: 'cover',
  },
  safeArea: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    paddingTop: 0,
    width: '100%',
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    backgroundColor: '#303030',
    height: APPBAR_HEIGHT,
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  backButtonContainer: {
    height: 60,
  },
  backButton: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    paddingLeft: 8,
  },
  backText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  courseInfo: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: -70,
    paddingVertical: 30,
    alignContent: 'space-between',
  },
  universityText: {
    fontSize: 18,
    color: '#ACCAF2',
    textAlign: 'right',
    fontWeight: '500',
  },
  courseName: {
    fontSize: 32,
    color: 'white',
    textAlign: 'right',
    fontWeight: 'bold',
    lineHeight: 40,
  },
  doctorText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'right',
    fontWeight: '500',
  },
  tabContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  tabNavigator: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    backgroundColor: '#F5F7FA',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
