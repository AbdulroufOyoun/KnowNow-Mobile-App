import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

import { useEffect, useState } from 'react';
import { FlatList, StatusBar, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ShowCoursePdf, showMyCourses } from '../router/data';
import CourseCard from '../Components/CourseCard';
import * as Network from 'expo-network';
import { MyCoursesScreenSkeleton } from '../Components/SkeletonLoader';

const currentDate = new Date();

const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
export default function MyCoursesScreen() {
  const [courses, setCourses] = useState<any>();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();
  useEffect(() => {
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Always try to load courses (will check internet inside getCourses)
    getCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        if (parsed.token != null && parsed.token_expire_at > formattedDate) {
          setToken(parsed.token);
        }
      } else {
        navigation.navigate('Login');
      }
    } catch {
      navigation.navigate('Login');
    }
  };

  const deletePDF = async (pdfName: string) => {
    const baseDir = (FileSystem.cacheDirectory || FileSystem.documentDirectory || '').replace(
      /\/?$/,
      '/'
    );
    const fileUri = baseDir + pdfName;

    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(fileUri, { idempotent: true });
      }
    } catch {
      // Error deleting PDF
    }
  };

  const getCourses = async () => {
    try {
      // Always load from storage first to show data immediately
      const storedData = await AsyncStorage.getItem('myCourses');
      const existingCourses = storedData ? JSON.parse(storedData) : [];

      // Show stored data immediately (if available) while checking internet
      if (existingCourses.length > 0) {
        setCourses(existingCourses);
        setLoading(false);
      }

      // Check internet connection
      const networkState = await Network.getNetworkStateAsync();
      const hasInternet = !!networkState.isInternetReachable;

      // If no internet, use stored data only
      if (!hasInternet) {
        if (existingCourses.length === 0) {
          setLoading(false);
        }
        return;
      }

      // If internet is available and we have token, try to fetch from API
      if (token) {
        showMyCourses(token)
          .then((response) => {
            const now = new Date().toISOString();
            const newCourses = response.data.data;

            const newIds = newCourses.map((item: any) => item.id);

            // Filter out old courses that still exist
            const filteredExisting = existingCourses.filter((item: any) =>
              newIds.includes(item.id)
            );

            // Collect removed courses
            const removedCourses = existingCourses.filter((item: any) => !newIds.includes(item.id));
            if (removedCourses.length > 0) {
              ShowCoursePdf(token, removedCourses)
                .then((response) => {
                  response.data.forEach((pdfName: any) => {
                    deletePDF(pdfName);
                  });
                })
                .catch(() => {
                  // Error deleting PDFs, continue anyway
                });
            }
            // Add new items
            const mergedCourses = [...filteredExisting];

            newCourses.forEach((newItem: any) => {
              const alreadyExists = filteredExisting.some(
                (existingItem: any) => existingItem.id === newItem.id
              );

              if (!alreadyExists) {
                mergedCourses.push({
                  ...newItem,
                  added_at: now,
                });
              }
            });

            setCourses(mergedCourses);
            setLoading(false);
            AsyncStorage.setItem('myCourses', JSON.stringify(mergedCourses));
          })
          .catch(() => {
            // If API fails, use stored data as fallback
            if (existingCourses.length > 0) {
              setCourses(existingCourses);
            }
            setLoading(false);
          });
      } else {
        // No token, use stored data only
        if (existingCourses.length === 0) {
          setLoading(false);
        }
      }
    } catch {
      // If any error occurs, try to load from storage
      try {
        const storedData = await AsyncStorage.getItem('myCourses');
        const existingCourses = storedData ? JSON.parse(storedData) : [];
        setCourses(existingCourses);
      } catch {
        // If storage also fails, show empty
        setCourses([]);
      }
      setLoading(false);
    }
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    await getCourses();
    setRefreshing(false);
  };
  return (
    <>
      {loading ? (
        <MyCoursesScreenSkeleton />
      ) : (
        <>
          <View style={{ marginTop: 30 }}>
            <StatusBar translucent barStyle="dark-content" />

            <FlatList
              data={courses}
              renderItem={({ item }) => <CourseCard data={item} />}
              keyExtractor={(item: any) => String(item.id)}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              ListEmptyComponent={() => (
                <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 20 }}>
                  لم تشترك بأي دورة بعد
                </Text>
              )}
            />
          </View>
        </>
      )}
    </>
  );
}
