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
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <StatusBar translucent barStyle="light-content" backgroundColor="#035AA6" />

            <View style={styles.headerSection}>
              <View style={styles.logoContainer}>
                <Ionicons name="school" size={60} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>تعلم الآن</Text>
              <Text style={styles.subtitle}>منصة التعليم الذكية</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="mail-outline"
                    size={22}
                    color={errors.email ? '#FF6B6B' : '#8593A6'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="البريد الالكتروني"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="#8593A6"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) {
                        setErrors({ ...errors, email: '' });
                      }
                    }}
                  />
                </View>
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={22}
                    color={errors.password ? '#FF6B6B' : '#8593A6'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, errors.password && styles.inputError]}
                    placeholder="كلمة المرور"
                    secureTextEntry
                    placeholderTextColor="#8593A6"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) {
                        setErrors({ ...errors, password: '' });
                      }
                    }}
                  />
                </View>
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => handleLogin()}
                disabled={loading}
                activeOpacity={0.8}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.buttonText}>تسجيل الدخول</Text>
                )}
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('SingUp')} activeOpacity={0.7}>
                  <Text style={styles.signupLink}>إنشاء حساب</Text>
                </TouchableOpacity>
                <Text style={styles.signupText}>ليس لديك حساب؟ </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerSection: {
    backgroundColor: '#035AA6',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#035AA6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#ACCAF2',
    fontWeight: '500',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    shadowColor: '#035AA6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#035AA6',
    textAlign: 'right',
    paddingVertical: 0,
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
    marginTop: 8,
    marginRight: 4,
    textAlign: 'right',
    fontWeight: '500',
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#035AA6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#035AA6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  signupText: {
    color: '#8593A6',
    fontSize: 16,
    textAlign: 'center',
  },
  signupLink: {
    color: '#035AA6',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
