import { useEffect, useState } from 'react';
import { getToken, onMessage as onFirebaseMessage } from 'firebase/messaging';

import { messaging } from './firebase';

export function useMessaging({ onMessage }) {
  const [token, setToken] = useState('');
  const [tokenError, setTokenError] = useState(null);

  function resetToken() {
    setToken('');
    setTokenError(null);
  }

  useEffect(() => {
    async function getMessagingToken() {
      try {
        const currentToken = await getToken(messaging, {
          vapidKey:
            'BIixOQ9aPiHyIxtNyanmtASdMolsHDgIW-gCqZZWHu6Ob6ldYrj6fDetnREaz1aVx7KAvzq-4slY_NIRiEr5eJI',
        });
        if (currentToken) {
          console.log('messaging token', currentToken);
          setToken(currentToken);
        } else {
          console.log(
            'No registration token available. Request permission to generate one.'
          );
        }
      } catch (error) {
        console.error('An error occurred while retrieving token. ', error);
        setTokenError(error);
      }
    }
    if (!token && !tokenError) getMessagingToken();
  }, [token, tokenError]);

  useEffect(() => {
    if (!token) {
      return;
    }
    return onFirebaseMessage(messaging, (payload) => {
      console.log('Firebase Data message received. ', payload);
      onMessage(payload);
    });
  }, [token, onMessage]);

  return {
    token,
    resetToken,
  };
}
