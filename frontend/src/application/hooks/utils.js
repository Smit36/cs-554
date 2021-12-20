import { useEffect, useContext } from 'react';

import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../application/firebase/auth';

export function useLoginRedirect() {
  const { currentUser } = useContext(AuthContext);
  console.log('Protected Route:', currentUser);

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [navigate, currentUser]);
}
