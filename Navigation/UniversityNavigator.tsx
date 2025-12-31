import { createNativeStackNavigator } from '@react-navigation/native-stack';
import YearScreen from 'Screens/YearsScreen';
import ChapterScreen from 'Screens/ChapterScreen';
import YearCoursesScreen from 'Screens/YearCoursesScreens';
import { useRoute } from '@react-navigation/native';
import SpecializationScreen from 'Screens/SpecializationsScreen';

const Stack = createNativeStackNavigator();

export default function UniversityNavigator() {
  const route = useRoute();
  const { token = null, university_id = null } = (route as any).params || {};
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Specialization"
        component={SpecializationScreen}
        initialParams={{ token, university_id }}
        options={{ title: 'اختر التخصص' }}
      />
      <Stack.Screen name="Years" component={YearScreen} options={{ title: 'اختر السنة' }} />
      <Stack.Screen name="Chapter" options={{ title: 'اختر الفصل' }} component={ChapterScreen} />
      <Stack.Screen name="Courses" component={YearCoursesScreen} />
    </Stack.Navigator>
  );
}
