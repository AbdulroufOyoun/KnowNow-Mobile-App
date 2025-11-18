import { Alert } from 'react-native';
import { isAxiosError } from 'axios';

export interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  data?: any;
}

/**
 * Handles API errors and displays appropriate messages to the user
 */
export const handleApiError = (error: any): string => {
  if (isAxiosError(error)) {
    // Network error
    if (!error.response) {
      return 'حدث خطأ في الاتصال. يرجى التحقق من اتصالك بالإنترنت';
    }

    // Server error with response
    const status = error.response.status;
    const errorData: ErrorResponse = error.response.data || {};

    switch (status) {
      case 400:
        return errorData.message || 'البيانات المدخلة غير صحيحة';
      case 401:
        return 'غير مصرح لك. يرجى تسجيل الدخول مرة أخرى';
      case 403:
        return 'ليس لديك صلاحية للوصول إلى هذا المحتوى';
      case 404:
        return 'المحتوى المطلوب غير موجود';
      case 422:
        // Validation errors
        if (errorData.errors) {
          const firstError = Object.values(errorData.errors)[0];
          return Array.isArray(firstError) ? firstError[0] : firstError;
        }
        return errorData.message || 'البيانات المدخلة غير صحيحة';
      case 429:
        return 'تم إرسال طلبات كثيرة. يرجى المحاولة لاحقاً';
      case 500:
        return 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً';
      case 503:
        return 'الخدمة غير متاحة حالياً. يرجى المحاولة لاحقاً';
      default:
        return errorData.message || 'حدث خطأ غير متوقع';
    }
  }

  // Non-Axios error
  if (error instanceof Error) {
    return error.message || 'حدث خطأ غير متوقع';
  }

  return 'حدث خطأ غير متوقع';
};

/**
 * Shows an alert with the error message
 */
export const showErrorAlert = (error: any, title: string = 'خطأ') => {
  const message = handleApiError(error);
  Alert.alert(title, message);
};

/**
 * Logs error for debugging (only in development)
 */
export const logError = (error: any, context?: string) => {
  if (__DEV__) {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
    if (isAxiosError(error) && error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
};
