import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyCoursesScreen from '../Screens/MyCoursesScreen';
import CourseDetailScreen from '../Screens/CourseDetailScreen';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function MyCoursesNavigation() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const userData = await AsyncStorage.getItem('user');
    const parsed = userData ? JSON.parse(userData) : null;
    const userToken: string | null = parsed?.token ?? null;
    setToken(userToken);
  };

  return (
    <Stack.Navigator initialRouteName="MyHome">
      <Stack.Screen
        name="MyHome"
        component={MyCoursesScreen}
        options={{ headerShown: false }}
        initialParams={{ token: token }}
      />
      <Stack.Screen
        name="CoursePlayList"
        component={CourseDetailScreen}
        options={{ headerShown: false }}
        initialParams={{ token: token }}
      />
    </Stack.Navigator>
  );
}
