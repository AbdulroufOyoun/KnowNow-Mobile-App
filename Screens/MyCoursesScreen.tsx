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
  const [isConnected, setIsConnected] = useState(false);
  const navigation = useNavigation<any>();
  useEffect(() => {
    checkInternet();
    getUserData();
    if (token) {
      getCourses();
    }
  }, [token]);
  const checkInternet = async () => {
    const networkState = await Network.getNetworkStateAsync();
    setIsConnected(!!networkState.isInternetReachable);
  };
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
  // type SavedPDF = {
  //   name: string;
  //   uri: string;
  // };

  // const listSavedPDFs = async (): Promise<SavedPDF[]> => {
  //   const dirUri = FileSystem.documentDirectory;

  //   if (!dirUri) {
  //     console.error('Document directory not available.');
  //     return [];
  //   }

  //   try {
  //     const files = await FileSystem.readDirectoryAsync(dirUri);

  //     // Filter only .pdf files
  //     const pdfFiles = files.filter((file) => file.toLowerCase().endsWith('.pdf'));

  //     // Map to full URIs
  //     const fullUris = pdfFiles.map((name) => ({
  //       name,
  //       uri: `${dirUri}${name}`,
  //     }));

  //     console.log('Saved PDFs:', fullUris);
  //     return fullUris;
  //   } catch (error) {
  //     console.error('Error reading PDF directory:', error);
  //     return [];
  //   }
  // };

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
      } else {
        console.log(`PDF not found: ${fileUri}`);
      }
    } catch (error) {
      console.error('Error deleting PDF:', error);
    }
  };

  const getCourses = async () => {
    const storedData = await AsyncStorage.getItem('myCourses');
    const existingCourses = storedData ? JSON.parse(storedData) : [];

    checkInternet();

    if (isConnected) {
      showMyCourses(token)
        .then((response) => {
          const now = new Date().toISOString();
          const newCourses = response.data.data;

          const newIds = newCourses.map((item: any) => item.id);

          // Filter out old courses that still exist
          const filteredExisting = existingCourses.filter((item: any) => newIds.includes(item.id));

          // Collect removed courses
          const removedCourses = existingCourses.filter((item: any) => !newIds.includes(item.id));
          if (removedCourses.length > 0) {
            ShowCoursePdf(token, removedCourses).then((response) => {
              response.data.forEach((pdfName: any) => {
                deletePDF(pdfName);
              });
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
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      setCourses(existingCourses);
    }
  };
  const handleRefresh = () => {
    setRefreshing(true);
    getCourses();
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
