import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

const Skeleton = ({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#E0E0E0',
          opacity,
        },
        style,
      ]}
    />
  );
};

// Skeleton for CourseCard
export const CourseCardSkeleton = () => {
  return (
    <View style={styles.cardContainer}>
      <Skeleton width={140} height={140} borderRadius={16} />
      <View style={styles.cardContent}>
        <Skeleton width="90%" height={20} style={styles.marginBottom} />
        <Skeleton width="70%" height={16} style={styles.marginBottom} />
        <Skeleton width="100%" height={14} style={styles.marginBottom} />
        <Skeleton width="80%" height={14} style={styles.marginBottom} />
        <View style={styles.priceRow}>
          <Skeleton width="60%" height={32} borderRadius={12} />
          <Skeleton width="30%" height={20} />
        </View>
      </View>
    </View>
  );
};

// Skeleton for UniversitiesCard
export const UniversityCardSkeleton = () => {
  return (
    <View style={styles.universityCard}>
      <Skeleton width={100} height={50} borderRadius={12} />
    </View>
  );
};

// Skeleton for CollectionList
export const CollectionListSkeleton = () => {
  return (
    <View style={styles.collectionContainer}>
      <View style={styles.collectionHeader}>
        <Skeleton width={120} height={24} borderRadius={8} />
        <Skeleton width={80} height={24} borderRadius={8} />
      </View>
      <View style={styles.collectionItems}>
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.collectionItem}>
            <Skeleton width={110} height={140} borderRadius={16} />
            <Skeleton width={90} height={20} style={styles.marginTop} />
          </View>
        ))}
      </View>
    </View>
  );
};

// Skeleton for HomeScreen
export const HomeScreenSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Universities Skeleton */}
      <View style={styles.universitiesSection}>
        <View style={styles.horizontalList}>
          {[1, 2, 3, 4].map((item) => (
            <UniversityCardSkeleton key={item} />
          ))}
        </View>
      </View>

      {/* Collections Skeleton */}
      <View style={styles.collectionsSection}>
        <CollectionListSkeleton />
      </View>

      {/* Courses Skeleton */}
      <View style={styles.coursesSection}>
        <Skeleton width={120} height={28} style={styles.sectionTitle} />
        {[1, 2, 3].map((item) => (
          <CourseCardSkeleton key={item} />
        ))}
      </View>
    </View>
  );
};

// Skeleton for SearchScreen
export const SearchScreenSkeleton = () => {
  return (
    <View style={styles.searchContainer}>
      <Skeleton width={150} height={24} style={styles.searchResultsTitle} />
      {[1, 2, 3, 4, 5].map((item) => (
        <View key={item} style={styles.searchCardWrapper}>
          <CourseCardSkeleton />
        </View>
      ))}
    </View>
  );
};

// Skeleton for MyCoursesScreen
export const MyCoursesScreenSkeleton = () => {
  return (
    <View style={styles.myCoursesContainer}>
      {[1, 2, 3, 4, 5].map((item) => (
        <View key={item} style={styles.myCoursesCardWrapper}>
          <CourseCardSkeleton />
        </View>
      ))}
    </View>
  );
};

// Skeleton for YearCoursesScreen
export const YearCoursesScreenSkeleton = () => {
  return (
    <View style={styles.yearCoursesContainer}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <View key={item} style={styles.yearCoursesCardWrapper}>
          <CourseCardSkeleton />
        </View>
      ))}
    </View>
  );
};

// Skeleton for AllCollectionsScreen
export const AllCollectionsScreenSkeleton = () => {
  return (
    <View style={styles.allCollectionsContainer}>
      {[1, 2, 3].map((item) => (
        <View key={item} style={styles.allCollectionsItem}>
          <CollectionListSkeleton />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F7FA',
    paddingBottom: 30,
  },
  cardContainer: {
    height: 160,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    marginHorizontal: '2%',
    borderRadius: 16,
    padding: 8,
    marginBottom: 10,
    shadowColor: '#035AA6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
    justifyContent: 'space-between',
  },
  marginBottom: {
    marginBottom: 6,
  },
  marginTop: {
    marginTop: 5,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    marginTop: 8,
  },
  universityCard: {
    margin: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#035AA6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 120,
  },
  collectionContainer: {
    marginBottom: 20,
  },
  collectionHeader: {
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
    marginBottom: 20,
    marginTop: 10,
  },
  collectionItems: {
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  collectionItem: {
    marginRight: 16,
  },
  universitiesSection: {
    backgroundColor: '#F5F7FA',
    paddingVertical: 16,
  },
  horizontalList: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  collectionsSection: {
    marginBottom: 20,
  },
  coursesSection: {
    backgroundColor: '#F5F7FA',
    paddingTop: 8,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    marginBottom: 20,
    marginTop: 10,
  },
  searchContainer: {
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },
  searchResultsTitle: {
    marginBottom: 12,
    marginRight: 0,
  },
  searchCardWrapper: {
    marginBottom: 12,
  },
  myCoursesContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 30,
    paddingHorizontal: '2%',
    paddingBottom: 30,
  },
  myCoursesCardWrapper: {
    marginBottom: 10,
  },
  yearCoursesContainer: {
    backgroundColor: '#F5F7FA',
    paddingTop: 30,
    paddingHorizontal: '2%',
    paddingBottom: 30,
  },
  yearCoursesCardWrapper: {
    marginBottom: 10,
  },
  allCollectionsContainer: {
    backgroundColor: '#F5F7FA',
    paddingTop: 16,
    paddingBottom: 30,
  },
  allCollectionsItem: {
    marginBottom: 20,
  },
});
