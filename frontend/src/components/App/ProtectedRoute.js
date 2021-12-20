import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../application/firebase/auth';
const ProtectedRoute = ({ children, isGroup = false }) => {
  const { currentUser } = useContext(AuthContext);
  console.log('Protected Route:', currentUser);

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [navigate, currentUser]);

  return currentUser && (currentUser.groupId || isGroup) ? (
    children
  ) : (
    <>403 Forbiddon</>
  );
};

export default ProtectedRoute;
