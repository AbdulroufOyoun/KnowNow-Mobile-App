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
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uid, setUid] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<any>();

  // Validation errors
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
    };

    let isValid = true;

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
      isValid = false;
    }

    // Validate password
    if (!password.trim()) {
      newErrors.password = 'كلمة المرور مطلوبة';
      isValid = false;
    } else if (!validatePassword(password)) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
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

  const getUserData = async () => {
    try {
      const userData = (await AsyncStorage.getItem('user')) ?? null;
      if (userData != null) {
        navigation.replace('MainNavigator');
      } else {
        const id = await AsyncStorage.getItem('device_uuid');
        setUid(id);
      }
    } catch {
      // Handle error silently
    }
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
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="البريد الالكتروني"
                keyboardType="email-address"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors({ ...errors, email: '' });
                  }
                }}
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="كلمة المرور"
                secureTextEntry
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors({ ...errors, password: '' });
                  }
                }}
              />
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>
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

  inputContainer: {
    width: '90%',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    color: 'black',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
    marginRight: 4,
    textAlign: 'right',
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
