import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CoursePlayList from '../Components/CoursePlayList';
import {
  Text,
  View,
  StatusBar,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createMaterialTopTabNavigator();
const screenHeight = Dimensions.get('window').height;
const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0;

export default function CourseDetailScreen() {
  const route = useRoute();
  const { item = null }: any = route.params || {};
  const navigation = useNavigation<any>();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        setToken(parsed?.token ?? null);
      } else {
        setToken(null);
      }
    } catch {
      setToken(null);
    }
  };

  // Check if data exists
  const hasPractical =
    item?.practical && Array.isArray(item.practical) && item.practical.length > 0;
  const hasTheoretical =
    item?.theoretical && Array.isArray(item.theoretical) && item.theoretical.length > 0;

  // Determine initial route
  const getInitialRoute = () => {
    if (hasTheoretical) return 'CourseLicture';
    if (hasPractical) return 'CoursePlay';
    return null;
  };

  const initialRoute = getInitialRoute();

  // Don't show tabs if no data
  if (!item || (!hasPractical && !hasTheoretical)) {
    return (
      <View style={styles.container}>
        <StatusBar translucent barStyle="dark-content" backgroundColor="#F5F7FA" />
        <ImageBackground source={{ uri: item?.image || '' }} style={styles.background}>
          <View style={styles.overlay}>
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.contentWrapper}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.7}
                  style={styles.backButton}>
                  <Feather name="chevron-right" size={24} color="white" />
                  <Text style={styles.backText}>رجوع</Text>
                </TouchableOpacity>
                <View style={styles.courseInfo}>
                  <Text style={styles.universityText}>{item?.university || ''}</Text>
                  <Text style={styles.courseName}>{item?.name || ''}</Text>
                  <Text style={styles.doctorText}>{item?.doctor || ''}</Text>
                </View>
              </View>
            </SafeAreaView>
          </View>
        </ImageBackground>
        <View style={styles.emptyContainer}>
          <Feather name="file-text" size={64} color="#8593A6" />
          <Text style={styles.emptyText}>لا يوجد محتوى متاح حالياً</Text>
          <Text style={styles.emptySubtext}>سيتم إضافة المحتوى قريباً</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#F5F7FA" />
      <ImageBackground source={{ uri: item?.image || '' }} style={styles.background}>
        <View style={styles.overlay}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.contentWrapper}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
                style={styles.backButton}>
                <Feather name="chevron-right" size={24} color="white" />
                <Text style={styles.backText}>رجوع</Text>
              </TouchableOpacity>
              <View style={styles.courseInfo}>
                <Text style={styles.universityText}>{item?.university || ''}</Text>
                <Text style={styles.courseName}>{item?.name || ''}</Text>
                <Text style={styles.doctorText}>{item?.doctor || ''}</Text>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </ImageBackground>
      <View style={styles.tabContainer}>
        {token && initialRoute ? (
          <Tab.Navigator
            initialRouteName={initialRoute}
            style={styles.tabNavigator}
            screenOptions={{
              tabBarLabelStyle: {
                fontSize: 15,
                fontWeight: '600',
                textAlign: 'right',
                writingDirection: 'rtl',
              },
              tabBarIndicatorStyle: {
                backgroundColor: '#3F83BF',
                height: 3,
                width: 'auto',
              },
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
              swipeEnabled: true,
              animationEnabled: true,
              lazy: false,
            }}>
            {hasPractical && (
              <Tab.Screen
                name="CoursePlay"
                options={{ tabBarLabel: 'عملي' }}
                initialParams={{
                  token: token,
                  data: item.practical || [],
                  isSubscribed: true,
                }}
                component={CoursePlayList}
              />
            )}
            {hasTheoretical && (
              <Tab.Screen
                name="CourseLicture"
                options={{ tabBarLabel: 'نظري' }}
                initialParams={{
                  token: token,
                  data: item.theoretical || [],
                  isSubscribed: true,
                }}
                component={CoursePlayList}
              />
            )}
          </Tab.Navigator>
        ) : (
          <View style={styles.emptyContainer}>
            <Feather name="lock" size={64} color="#8593A6" />
            <Text style={styles.emptyText}>يجب تسجيل الدخول لعرض المحتوى</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  safeArea: {
    flex: 1,
  },
  background: {
    height: screenHeight * 0.3,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    paddingTop: 0,
    width: '100%',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginTop: 8,
    zIndex: 10,
  },
  backText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 4,
  },
  courseInfo: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingVertical: 30,
  },
  universityText: {
    fontSize: 18,
    color: '#ACCAF2',
    textAlign: 'right',
    fontWeight: '500',
  },
  courseName: {
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'right',
    fontWeight: 'bold',
    lineHeight: 40,
  },
  doctorText: {
    fontSize: 20,
    color: '#FFFFFF',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
    backgroundColor: '#F5F7FA',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#035AA6',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8593A6',
    textAlign: 'center',
  },
});
