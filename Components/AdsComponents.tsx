import { useEffect, useState } from 'react';
import { FlatList, Image, View } from 'react-native';
import { showAds } from 'router/data';
export default function AdsComponent() {
  const [entries, setEntries] = useState<any>([]);
  useEffect(() => {
    getAds();
  }, []);
  const getAds = () => {
    showAds().then((res) => {
      setEntries(res.data.data);
    });
  };

  type AdCardProps = {
    image: string;
  };

  const AdCard = ({ image }: AdCardProps) => (
    <View className="mt-2">
      <Image source={{ uri: image }} className="me-3 h-52 w-80 rounded-lg" resizeMode="cover" />
    </View>
  );

  return (
    <FlatList
      data={entries}
      renderItem={({ item }) => <AdCard image={item.image} />}
      keyExtractor={(item) => item.id}
      horizontal
      inverted
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 8 }}
    />
  );
}
