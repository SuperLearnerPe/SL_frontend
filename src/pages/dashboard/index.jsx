import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, Grid, Grow, TextField, InputAdornment, CircularProgress, Typography } from '@mui/material';
import CourseCard from './courses/courseCard/CourseCard';
import { formatTime } from '../../utils/formatTime';
import SearchOutlined from '@ant-design/icons/SearchOutlined';

export default function DashboardDefault() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('id');
    const roleId = localStorage.getItem('role');


    setIsLoading(true);
    setError(null);

    axios.get('https://backend-superlearner-1083661745884.us-central1.run.app/api/class/get_courses/', 
      {
        params: {
          user_id: Number(userId), 
          role_id: Number(roleId),  
        },
        headers: {
          'Accept': '*/*',
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      }
    )
      .then(response => {
        setCourses(response.data);
        setFilteredCourses(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching courses:', error.response ? error.response.data : error);
        setError('Error al cargar los cursos. Por favor, intente de nuevo más tarde.');
        setIsLoading(false);
      });
      
  }, []);

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);

    const filtered = courses.filter((course) =>
      course.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  return (
    <Container maxWidth="lg">
      <Box my={4} marginTop={0}>
        <TextField
          label="Buscar cursos"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredCourses.map((course, index) => (
              <Grow
                in={true}
                style={{ transformOrigin: '0 0 0' }}
                {...{ timeout: 1000 + index * 200 }}
                key={course.id || index}
              >
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <CourseCard
                    courseId={course.id}
                    courseName={course.name}
                    day={course.day}
                    time={course.start_time && course.end_time ? formatTime(course.start_time, course.end_time) : 'N/A'}
                    initialColor={course.color || '#1976d2'}
                  />
                </Grid>
              </Grow>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}