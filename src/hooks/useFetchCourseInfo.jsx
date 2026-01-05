import { useState } from 'react';
import axios from 'axios';

const useFetchCourseInfo = (courseId) => {
  const [courseInfo, setCourseInfo] = useState(null);

  const fetchCourseInfo = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/course/${courseId}`, {
        headers: {
          Authorization: `Token ${token}`
        },
      });
      setCourseInfo(response.data);
    } catch (error) {
      console.error('Error fetching course info:', error);
    }
  };

  return { courseInfo, fetchCourseInfo };
};

export default useFetchCourseInfo;
