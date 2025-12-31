import React from 'react';
import { Alert, TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import HomeScreen from '../Screens/HomeScreen';
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
            AsyncStorage.removeItem('user');
          }
        })
        .catch(() => {
          AsyncStorage.removeItem('user');
          navigation.navigate('Login');
        });
    } else {
      navigation.navigate('Login');
    }
  };

  const LogoutButton = () => {
    const handleLogout = () => {
      Alert.alert('تسجيل الخروج', 'هل أنت متأكد أنك تريد تسجيل الخروج؟', [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تسجيل الخروج',
          style: 'destructive',
          onPress: () => LogoutUser(),
        },
      ]);
    };

    return (
      <TouchableOpacity style={styles.logoutButton} onPress={() => handleLogout()}>
        <Feather name="log-out" size={20} color="#FF6B6B" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </TouchableOpacity>
    );
  };

  const CustomDrawerContent = (props: any) => {
    return (
      <DrawerContentScrollView {...props} style={styles.drawerContent}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>تعلم الآن</Text>
          <Text style={styles.drawerSubtitle}>منصة التعليم الذكية</Text>
        </View>
        <DrawerItemList {...props} />
        <View style={styles.drawerFooter}>
          <LogoutButton />
        </View>
      </DrawerContentScrollView>
    );
  };
  const DrawerNavigator = () => {
    return (
      <Drawer.Navigator
        drawerContent={(props: any) => <CustomDrawerContent {...props} />}
        screenOptions={({ navigation }: any) => ({
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: '500',
            color: '#035AA6',
            marginLeft: -20,
            marginRight: 8,
          },
          drawerActiveTintColor: '#035AA6',
          drawerInactiveTintColor: '#8593A6',
          drawerActiveBackgroundColor: '#ACCAF2',
          drawerItemStyle: {
            borderRadius: 12,
            marginHorizontal: 8,
            marginVertical: 4,
          },
          headerStyle: {
            height: Platform.OS === 'ios' ? 120 : undefined,
            backgroundColor: '#F5F7FA',
            elevation: 2,
            shadowColor: '#035AA6',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          headerTintColor: '#035AA6',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
            color: '#035AA6',
          },
          headerLeft: () => (
            <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.openDrawer()}>
              <Feather name="menu" size={24} color="#035AA6" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Search')}>
              <Feather name="search" size={24} color="#035AA6" />
            </TouchableOpacity>
          ),
        })}>
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'الصفحة الرئيسية',
            drawerIcon: ({ color, size }: any) => (
              <Feather name="home" style={{ marginRight: 20 }} size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="MyCourses"
          component={MyCoursesNavigation}
          options={{
            title: 'دوراتي',
            drawerIcon: ({ color, size }: any) => (
              <Feather name="book" style={{ marginRight: 20 }} size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{
            title: 'تغيير كلمة المرور',
            drawerIcon: ({ color, size }: any) => (
              <Feather name="lock" style={{ marginRight: 20 }} size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="About Us"
          component={AboutUsScreen}
          options={{
            title: 'نبذة عنا',
            drawerIcon: ({ color, size }: any) => (
              <Feather style={{ marginRight: 20 }} name="info" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Privacy"
          component={PrivacyScreen}
          options={{
            title: 'سياسة الخصوصية',
            drawerIcon: ({ color, size }: any) => (
              <Feather name="shield" style={{ marginRight: 20 }} size={size} color={color} />
            ),
          }}
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
      <Stack.Screen name="Pdf" component={ShowPdfScreen} />
      <Stack.Screen name="Video" component={ShowCourseVideo} />
      <Stack.Screen name="Years" component={UniversityNavigator} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    backgroundColor: '#F5F7FA',
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: '#035AA6',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'right',
  },
  drawerSubtitle: {
    fontSize: 14,
    color: '#ACCAF2',
    textAlign: 'right',
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
    marginTop: 'auto',
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  button: {
    marginRight: 10,
    padding: 10,
    backgroundColor: '#3F83BF',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutIcon: {
    marginLeft: 8,
  },
  logoutText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  iconButton: {
    marginRight: 15,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#035AA6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  drawerButton: {
    marginLeft: 15,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#035AA6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
