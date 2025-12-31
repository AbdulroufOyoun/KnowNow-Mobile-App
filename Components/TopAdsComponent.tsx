import { useEffect, useState } from 'react';
import { FlatList, Image, View, StyleSheet, Dimensions } from 'react-native';
import { showAds } from 'router/data';

const screenWidth = Dimensions.get('window').width;

export default function TopAdsComponent() {
  const [entries, setEntries] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAds();
  }, []);

  const getAds = () => {
    setLoading(true);
    showAds()
      .then((res) => {
        if (res.data && res.data.data) {
          setEntries(res.data.data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  type AdCardProps = {
    image: string;
  };

  const AdCard = ({ image }: AdCardProps) => (
    <View style={styles.adCardContainer}>
      <Image source={{ uri: image }} style={styles.adImage} resizeMode="cover" />
    </View>
  );

  if (loading || entries.length === 0) {
    return null;
  }

  return (
    <FlatList
      data={entries}
      renderItem={({ item }) => <AdCard image={item.image} />}
      keyExtractor={(item: any, index: number) => item?.id?.toString() || index.toString()}
      horizontal
      inverted
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  adCardContainer: {
    marginTop: 8,
    marginRight: 12,
  },
  adImage: {
    width: screenWidth * 0.8,
    height: 208,
    borderRadius: 16,
  },
});
