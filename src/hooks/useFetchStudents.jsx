import { useState } from 'react';
import axios from 'axios';

const useFetchStudents = (courseId) => {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`https://backend-url/api/class/getStudents/?class_id=${courseId}`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  return { students, fetchStudents };
};

export default useFetchStudents;
