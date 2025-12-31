import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const url = 'https://learnnowsyria.com/api/';
// const url = 'http://192.168.1.5:8888/api/';

export async function getUserData(): Promise<string | null> {
  try {
    const userData = await AsyncStorage.getItem('user');
    if (userData !== null) {
      return JSON.parse(userData).token ?? null;
    } else {
      return null;
    }
  } catch {
    return null;
  }
}
export function getUrl() {
  return url;
}

// Auth
export function Login(data: any) {
  return axios.post(url + 'login', data);
}
export function SignUp(data: any) {
  return axios.post(url + 'signUp', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
export function changePassword(data: any, token: any) {
  return axios.post(url + 'change_password', data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });
}
// Media
export function showMedia() {
  return axios.get(url + 'show_media');
}

// Collections
export function showCollections(token: any, page = 1, perPage = 10) {
  console.log(token);

  return axios.get(url + 'show_collections', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
      perPage: perPage,
    },
    params: {
      page: page,
    },
  });
}
export function checkSubscribeCollection(token: any, collectionId: any) {
  return axios.get(url + 'check_subscribe_collection', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    params: {
      collectionId: collectionId,
    },
  });
}

// Course
export function showCourses(token: any, page = 1) {
  return axios.get(url + 'show_courses', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    params: {
      page: page,
    },
  });
}
export function showAds() {
  return axios.get(url + 'show_ads');
}
export function showMyCourses(token: any) {
  return axios.get(url + 'show_user_courses', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });
}

export function ShowCoursePdf(token: any, courseIds: any) {
  return axios.get(url + 'show_courses_pdf', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    params: {
      courseIds: courseIds,
    },
  });
}
export function SearchCourses(token: any, name: any) {
  return axios.get(url + 'search_course', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    params: {
      name: name,
    },
  });
}

export function coursesContain(token: any, courseId: any) {
  return axios.get(url + 'show_course_contain', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    params: {
      courseId: courseId,
    },
  });
}
export function ShowPdf(token: any, pdf: any) {
  return axios.get(url + 'pdf', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    params: {
      pdf: pdf,
    },
  });
}

export function ShowVideo(token: any, video: any) {
  return axios.get(url + 'video', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    params: {
      video: video,
    },
  });
}
export function showAboutCourse(token: any, courseId: any) {
  return axios.get(url + 'show_course_details', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    params: {
      courseId: courseId,
    },
  });
}
// Course Codes
export function subscribe(data: any, token: any) {
  return axios.post(url + 'add_user_code', data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });
}
export function logout(token: any) {
  return axios.delete(url + 'logout', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });
}
// FCM
export function updateFcmToken(token: any, fcm_token: string) {
  return axios.post(
    url + 'update_token',
    { fcm_token: fcm_token },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }
  );
}

// Year Courses
export function showYearCourses(
  token: any,
  chapter: number,
  year: number,
  specialization_id: number
) {
  return axios.get(url + 'show_year_courses', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    params: {
      year: year,
      chapter: chapter,
      specialization_id: specialization_id,
    },
  });
}

// University
export function showUniversities() {
  return axios.get(url + 'show_universities');
}

export function showSpecialization(token: any, university_id: number) {
  return axios.get(url + 'show_specializations', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    params: {
      university_id: university_id,
    },
  });
}

export function showSpecializationYears(token: any, specialization_id: number) {
  return axios.get(url + 'show_years', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    params: {
      specialization_id: specialization_id,
    },
  });
}
