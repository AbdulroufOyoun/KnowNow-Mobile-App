import './global.css';

import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { allowScreenCaptureAsync, preventScreenCaptureAsync } from 'expo-screen-capture';

import { Dimensions, Text, View } from 'react-native';
import LoginScreen from './Screens/LoginScreen';
import SignUpScreen from './Screens/SignUpScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainNavigator from './Navigation/MainNavigator';
const Stack = createNativeStackNavigator();

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
// const toggleScreenCapture = async () => {
//   await allowScreenCaptureAsync();
// };

export default function App() {
  preventScreenCaptureAsync();
  // toggleScreenCapture();

  return (
    <>
      {isTablet ? (
        <View>
          <Text>This app is not designed for tablets.</Text>
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
