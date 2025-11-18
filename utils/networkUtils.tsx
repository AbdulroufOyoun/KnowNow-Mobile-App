import * as Network from 'expo-network';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string | null;
}

/**
 * Checks if device has internet connection
 */
export const checkInternetConnection = async (): Promise<boolean> => {
  try {
    const networkState = await Network.getNetworkStateAsync();
    return !!networkState.isInternetReachable;
  } catch (error) {
    console.error('Error checking network state:', error);
    return false;
  }
};

/**
 * Gets detailed network state
 */
export const getNetworkState = async (): Promise<NetworkState> => {
  try {
    const networkState = await Network.getNetworkStateAsync();
    return {
      isConnected: !!networkState.isConnected,
      isInternetReachable: !!networkState.isInternetReachable,
      type: networkState.type || null,
    };
  } catch (error) {
    console.error('Error getting network state:', error);
    return {
      isConnected: false,
      isInternetReachable: false,
      type: null,
    };
  }
};

/**
 * Custom hook to monitor network state
 */
export const useNetworkState = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: true,
    isInternetReachable: true,
    type: null,
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkConnection = async () => {
      const state = await getNetworkState();
      setNetworkState(state);
      setIsConnected(state.isInternetReachable);
    };

    // Check immediately
    checkConnection();

    // Check every 5 seconds
    intervalId = setInterval(checkConnection, 5000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return { isConnected, networkState };
};

/**
 * Network status banner component
 */
export const NetworkBanner = ({ isConnected }: { isConnected: boolean }) => {
  if (isConnected) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>⚠️ لا يوجد اتصال بالإنترنت</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
