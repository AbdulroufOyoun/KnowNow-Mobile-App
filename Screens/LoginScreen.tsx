import { useNavigation } from '@react-navigation/native';

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { Login } from '../router/data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uid, setUid] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<any>();

  useEffect(() => {
    getUserData();
  }, [uid]);
  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Password is required');
      return;
    }
    setLoading(true);
    Keyboard.dismiss();
    Login({ email: email, password: password, mobile_uuid: uid })
      .then((response) => {
        AsyncStorage.setItem('user', JSON.stringify(response.data.data));
        setLoading(false);

        navigation.navigate('MainNavigator');
      })
      .catch((error) => {
        Alert.alert('Wrong Data', error.response.data.message);
        setLoading(false);
      });
  };

  const getDeviceId = async () => {
    if (Device.osInternalBuildId) {
      return Device.osInternalBuildId + Device.modelId; // Unique hardware identifier for Android devices
    } else {
      return Device.deviceName || 'Unknown Device';
    }
  };
  const getUserData = async () => {
    try {
      const userData = (await AsyncStorage.getItem('user')) ?? null;
      if (userData != null) {
        navigation.replace('MainNavigator');
      } else {
        const id = await getDeviceId();
        setUid(id);
      }
    } catch (error) {}
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <StatusBar translucent barStyle="dark-content" />

            <Text style={styles.title}> تعلم بأسلوبك، في وقتك، من أي مكان</Text>
            <TextInput
              style={styles.input}
              placeholder="البريد الالكتروني"
              keyboardType="email-address"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="كلمة المرور"
              secureTextEntry
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleLogin()}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.buttonText, loading && styles.buttonDisabled]}>
                  تسجيل الدخول
                </Text>
              )}
            </TouchableOpacity>
            <Text style={styles.signupText}>
              ليس لديك حساب؟
              <TouchableNativeFeedback onPress={() => navigation.navigate('SingUp')}>
                <Text style={styles.signupLink}>انشاء حساب</Text>
              </TouchableNativeFeedback>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 24,
    lineHeight: 45,
    // letterSpacing: 1,
    writingDirection: 'rtl',
  },

  input: {
    width: '90%',
    color: 'black',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#0066cc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupText: {
    marginTop: 16,
    color: '#555',
    fontSize: 17,
  },
  signupLink: {
    color: '#0066cc',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
