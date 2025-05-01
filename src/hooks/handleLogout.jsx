
export const handleLogout = () => {
    
    localStorage.removeItem('id');
    localStorage.removeItem('access_token');
    localStorage.removeItem('login_time')
  
 
    window.location.href = '/login'; 
  };

export default handleLogout;
