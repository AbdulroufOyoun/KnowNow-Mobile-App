import { useRoute } from '@react-navigation/native';
import CourseCard from 'Components/CourseCard';
import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { showYearCourses } from 'router/data';
import { YearCoursesScreenSkeleton } from '../Components/SkeletonLoader';

export default function YearCoursesScreen() {
  const route = useRoute();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    token = null,
    specialization_id = null,
    chapter = null,
    year = null,
  } = (route as any).params || {};

  useEffect(() => {
    getCourses();
  }, [token]);

  const getCourses = () => {
    if (!token || !chapter || !year || !specialization_id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    showYearCourses(token, chapter, year, specialization_id)
      .then((response) => {
        setCourses(response.data.data);
        setLoading(false);
      })
      .catch((error: any) => {
        console.log(error.message);
        setLoading(false);
      });
  };

  if (loading) {
    return <YearCoursesScreenSkeleton />;
  }

  return (
    <View style={{ marginTop: 30 }}>
      <FlatList
        data={courses}
        renderItem={({ item }) => <CourseCard data={item} />}
        keyExtractor={(item: any) => String(item.id)}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={() => (
          <View style={{ paddingTop: 100, alignItems: 'center' }}>
            <Text style={{ fontSize: 25 }}>لا يوجد محتوى هنا</Text>
          </View>
        )}
      />
    </View>
  );
}
