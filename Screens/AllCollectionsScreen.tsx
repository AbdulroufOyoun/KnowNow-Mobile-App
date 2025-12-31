import {
  Text,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState, useCallback } from 'react';
import CollectionList from '../Components/CollectionList';
import { showCollections } from '../router/data';
import { AllCollectionsScreenSkeleton } from '../Components/SkeletonLoader';
import { useNetworkState, NetworkBanner } from '../utils/networkUtils';
import { showErrorAlert, logError } from '../utils/errorHandler';

const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0;

const MyStatusBar = ({ backgroundColor }: any) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} barStyle="light-content" />
  </View>
);

export default function AllCollectionsScreen() {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const [collections, setCollections] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { isConnected } = useNetworkState();

  const { token = null }: any = route.params || {};

  const getCollections = useCallback(
    async (pageNumber: number, isRefresh: boolean = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else if (pageNumber === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const response = await showCollections(token, pageNumber, 10);
        const newCollections = response.data.data || [];

        if (isRefresh || pageNumber === 1) {
          setCollections(newCollections);
        } else {
          setCollections((prevCollections) => [...prevCollections, ...newCollections]);
        }

        // Check if there are more items to load
        setHasMore(newCollections.length === 10);
      } catch (error) {
        logError(error, 'AllCollectionsScreen - getCollections');
        if (pageNumber === 1) {
          showErrorAlert(error, 'خطأ في تحميل العروض');
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      getCollections(1);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleRefresh = useCallback(() => {
    setPage(1);
    setHasMore(true);
    getCollections(1, true);
  }, [getCollections]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && isConnected) {
      const nextPage = page + 1;
      setPage(nextPage);
      getCollections(nextPage);
    }
  }, [loadingMore, hasMore, isConnected, page, getCollections]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <MyStatusBar backgroundColor="#035AA6" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.backButton}>
            <Feather name="chevron-right" size={24} color="#FFFFFF" />
            <Text style={styles.backText}>رجوع</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>آخر العروض</Text>
            <Text style={styles.headerSubtitle}>عروض حصرية على الدورات التعليمية</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#035AA6" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Feather name="package" size={64} color="#8593A6" />
        <Text style={styles.emptyText}>لا توجد عروض متاحة حالياً</Text>
        <Text style={styles.emptySubtext}>تحقق من الاتصال بالإنترنت وحاول مرة أخرى</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <NetworkBanner isConnected={isConnected} />
      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <MyStatusBar backgroundColor="#035AA6" />
          <AllCollectionsScreenSkeleton />
        </View>
      ) : (
        <FlatList
          data={collections}
          renderItem={({ item }) => <CollectionList data={item} token={token} />}
          keyExtractor={(item: any, index: number) => `collection-${item.id}-${index}`}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  safeArea: {
    backgroundColor: '#035AA6',
  },
  headerContainer: {
    backgroundColor: '#035AA6',
    paddingBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginRight: 8,
  },
  backText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 4,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'right',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ACCAF2',
    textAlign: 'right',
  },
  listContent: {
    // paddingTop: 16,
    paddingBottom: 20,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#035AA6',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8593A6',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
});
