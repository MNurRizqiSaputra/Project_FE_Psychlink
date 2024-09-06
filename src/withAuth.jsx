// withAuth.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const withAuth = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && allowedRoles.includes(user.role)) {
      return <WrappedComponent {...props} />;
    } else if (!user) {
      return <Navigate to="/" />;
    } else {
      // Redirect to the user's home page based on their role
      switch (user.role) {
        case 'pasien':
          return <Navigate to="/homepasien" />;
        case 'psikolog':
          return <Navigate to="/homepsikolog" />;
        case 'admin':
          return <Navigate to="/homeadmin" />;
        default:
          // If user has no role or an invalid role, redirect to a default home page or handle it as appropriate
          return <Navigate to="/" />;
      }
    }
  };
};

export default withAuth;