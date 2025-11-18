import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import React, { useCallback } from 'react';

type NewsProps = {
  id: string;
  name: string;
  token: any;
  navigation: any;
};

const UniversitiesCard = ({ id, name, navigation, token }: NewsProps) => {
  const handlePress = useCallback(() => {
    navigation.navigate('Years', {
      token: token,
      university_id: id,
    });
  }, [navigation, token, id]);

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <Text style={styles.text}>{name}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#035AA6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#3F83BF',
    minWidth: 120,
  },
  text: {
    color: '#035AA6',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default React.memo(UniversitiesCard);
