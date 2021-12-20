import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useMessaging } from '../firebase/hooks';
import { userSelector } from '../redux/selectors';
import { subscribeGroupTopic, unsubscribeGroupTopic } from '../api';

export function useGroupTopic({ onMessage }) {
  const { token } = useMessaging({ onMessage });
  const { groupId } = useSelector(userSelector);

  useEffect(() => {
    if (!token || !groupId) {
      return;
    }
    async function subscribe() {
      try {
        return await subscribeGroupTopic({ groupId, token });
      } catch (error) {
        console.error('Cannot subscribe to group message:', groupId, error);
      }
    }
    async function unsubscribe() {
      try {
        return await unsubscribeGroupTopic({ groupId, token });
      } catch (error) {
        console.error('Cannot unsubscribe to group message:', groupId, error);
      }
    }
    subscribe();
    return unsubscribe;
  }, [token, groupId]);
}
