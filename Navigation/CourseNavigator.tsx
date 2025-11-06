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
    <View style={{ flex: 1 }}>
      <MyStatusBar backgroundColor="#474747" />
      <ImageBackground
        source={{ uri: item?.image || '' }} // safe guard
        style={styles.background}>
        <View style={styles.overlay}>
          <SafeAreaView style={styles.safeArea}>
            <View>
              <View style={styles.background}>
                <TouchableWithoutFeedback
                  onPress={() => navigation.goBack()}
                  style={{ height: 60 }}>
                  <View style={{ flexDirection: 'row', height: 60 }}>
                    <Feather name="chevron-left" size={28} color="white" />
                    <Text style={{ fontSize: 20, color: 'white' }}> رجوع </Text>
                  </View>
                </TouchableWithoutFeedback>

                <View
                  style={{
                    flex: 1,
                    justifyContent: 'space-between',
                    marginTop: -70,
                    paddingVertical: 30,
                    alignContent: 'space-between',
                  }}>
                  <Text style={{ fontSize: 20, color: 'white', textAlign: 'right' }}>
                    {item?.university || ''}
                  </Text>
                  <Text style={{ fontSize: 40, color: 'white', textAlign: 'right' }}>
                    {item?.name || ''}
                  </Text>
                  <Text style={{ fontSize: 25, color: 'white', textAlign: 'right' }}>
                    {item?.doctor}
                  </Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </ImageBackground>
      <View style={{ flex: 1, height: 500, backgroundColor: 'red' }}>
        {loading ? (
          <View style={{ backgroundColor: 'white', flex: 1 }}>
            <Loading />
          </View>
        ) : (
          <Tab.Navigator
            initialRouteName="AboutCourse"
            style={{ flex: 1, backgroundColor: 'green', height: '100%' }}
            screenOptions={{
              tabBarLabelStyle: {
                fontSize: 14,
                // fontWeight: 'bold',
                textAlign: 'right',
                writingDirection: 'rtl',
              },
              tabBarIndicatorStyle: { backgroundColor: 'blue' },
              tabBarActiveTintColor: 'red', // 👈 selected tab label color
              tabBarInactiveTintColor: 'gray', // 👈 unselected tab label color
            }}>
            <Tab.Screen
              name="Subscribe"
              options={{ tabBarLabel: 'اشتراك' }}
              initialParams={{ courseId: data, contain: contain, token: token }}>
              {(props: any) => <SubscribeComponent {...props} />}
            </Tab.Screen>
            {contain && (
              <>
                {contain.practical && (
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
                {contain.theoretical && (
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
    // backgroundColor: '#dbdbdb', // Neutral-800 equivalent
    paddingTop: Platform.OS === 'android' ? 0 : 0,

    // paddingTop: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Adds a semi-transparent overlay
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
});
