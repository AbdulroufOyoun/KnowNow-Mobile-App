import './global.css';

import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { Dimensions, Text, View } from 'react-native';
import { useEffect } from 'react';
import { preventScreenCaptureAsync, allowScreenCaptureAsync } from 'expo-screen-capture';
import LoginScreen from './Screens/LoginScreen';
import SignUpScreen from './Screens/SignUpScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainNavigator from './Navigation/MainNavigator';
const Stack = createNativeStackNavigator();

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function App() {
  useEffect(() => {
    preventScreenCaptureAsync();
  }, []);

  return (
    <>
      {isTablet ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F5F7FA',
            padding: 20,
          }}>
          <Text style={{ fontSize: 18, textAlign: 'center', color: '#035AA6' }}>
            هذا التطبيق مصمم للهواتف الذكية فقط
          </Text>
          <Text style={{ fontSize: 14, textAlign: 'center', color: '#8593A6', marginTop: 10 }}>
            This app is designed for smartphones only
          </Text>
        </View>
      ) : (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="MainNavigator"
              component={MainNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SingUp" component={SignUpScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
}
