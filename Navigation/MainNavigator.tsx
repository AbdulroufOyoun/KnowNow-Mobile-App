import React from 'react';
import { Alert, TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import HomeScreen from '../Screens/HomeScreen';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import { Feather } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../router/data';
import SearchScreen from '../Screens/SearchScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CourseNavigator from './CourseNavigator';
import MyCoursesNavigation from './MyCoursesNavigation';
import AllCollectionsScreen from '../Screens/AllCollectionsScreen';
import CollectionNavigator from './CollectionNavigator';
import ShowPdfScreen from '../Screens/ShowPdfScreen';
import ShowCourseVideo from '../Screens/ShowCourseVideo';
import UniversityNavigator from './UniversityNavigator';
import AboutUsScreen from 'Screens/AboutUsScreen';
import PrivacyScreen from 'Screens/PrivacyScreen';
import ChangePasswordScreen from 'Screens/ChangePasswordScreen';
const Drawer = createDrawerNavigator();

export default function MainNavigator() {
  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const userToken: string | null = userData ? (JSON.parse(userData).token ?? null) : null;
      return userToken;
    } catch {
      return null;
    }
  };
  const navigation = useNavigation<any>();
  const LogoutUser = async () => {
    const token = await getUserData();
    if (!token) {
      navigation.navigate('Login');
    }
    AsyncStorage.removeItem('user');
    if (token) {
      logout(token)
        .then((response: any) => {
          try {
            navigation.navigate('Login');
          } catch {
            // console.error('Error deleting user data:', error);
            AsyncStorage.removeItem('user');
          }
        })
        .catch(() => {
          // console.error('Error deleting user data:', error.response.data.message);
          AsyncStorage.removeItem('user');
          navigation.navigate('Login');
        });
    } else {
      navigation.navigate('Login');
    }
  };

  const LogoutButton = () => {
    const handleLogout = () => {
      Alert.alert(
        'تسجيل الخروج', // Title
        'هل أنت متأكد أنك تريد تسجيل الخروج؟', // Message
        [
          { text: 'إلغاء', style: 'cancel' }, // Cancel button
          { text: 'تسجيل الخروج', onPress: () => LogoutUser() }, // Logout action
        ]
      );
    };

    return (
      <TouchableOpacity style={styles.logoutButton} onPress={() => handleLogout()}>
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </TouchableOpacity>
    );
  };

  const CustomDrawerContent = (props: any) => {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />

        <LogoutButton />
      </DrawerContentScrollView>
    );
  };
  const DrawerNavigator = () => {
    return (
      <Drawer.Navigator
        drawerContent={(props: any) => <CustomDrawerContent {...props} />}
        screenOptions={({ navigation }: any) => ({
          drawerLabelStyle: { fontSize: 17 },
          headerStyle: {
            height: Platform.OS === 'ios' ? 120 : undefined,
            backgroundColor: '#fff', // optional
          },

          headerRight: () => (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Search')}>
              <Feather name="search" size={30} color="gray" />
            </TouchableOpacity>
          ),
        })}>
        <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'الصفحة الرئيسية' }} />
        {/* <Drawer.Screen
          name="MyCourses"
          component={MyCoursesNavigation}
          options={{ title: 'دوراتي' }}
        /> */}
        <Drawer.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{ title: 'تغيير كلمة المرور' }}
        />
        <Drawer.Screen name="About Us" component={AboutUsScreen} options={{ title: 'نبذة عنا' }} />
        <Drawer.Screen
          name="Privacy"
          component={PrivacyScreen}
          options={{ title: 'سياسة الخصوصية' }}
        />
      </Drawer.Navigator>
    );
  };
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="CoursePlayList" component={CourseNavigator} />
      <Stack.Screen name="AllCollections" component={AllCollectionsScreen} />
      <Stack.Screen name="Collection" component={CollectionNavigator} />
      {/* <Stack.Screen name="Pdf" component={ShowPdfScreen} /> */}
      <Stack.Screen name="Video" component={ShowCourseVideo} />
      <Stack.Screen name="Years" component={UniversityNavigator} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
    padding: 10,
    backgroundColor: '#0066cc',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  iconButton: {
    marginRight: 15,
    padding: 10,
    borderRadius: 50,
  },
});
