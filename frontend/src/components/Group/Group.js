import { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import { Container, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import GroupForm from './GroupForm';
import Button from '@mui/material/Button';

import { AuthContext } from '../../application/firebase/auth';
import { setUser } from '../../application/redux/actions/user';
import { axiosGet, axiosPost, axiosPut } from '../../application/api/utils';

const Group = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [groupList, setGroupList] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [group, setGroup] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    let isUnmount = false;
    async function fetchGroup() {
      console.log('here');
      console.log('current USer here:', currentUser);
      try {
        setLoading(true);
        if (currentUser.groupId !== null) {
          const data = await axiosGet(`/group/${currentUser.groupId}`);
          if (!isUnmount) {
            setGroup(data);
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching Group List', error);
        setError(error);
        setLoading(false);
      }
    }
    fetchGroup();
    return () => {
      isUnmount = true;
    };
  }, [currentUser.groupId]);

  useEffect(() => {
    let isUnmount = false;
    async function fetchGroup() {
      try {
        const data = await axiosGet('/group');
        if (!isUnmount && data) {
          setGroupList(data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching Group', error);
        setError(error);
        setLoading(false);
      }
    }
    fetchGroup();
    return () => {
      isUnmount = true;
    };
  }, [currentUser.groupId]);

  //Join Group Function
  async function joinGroup({ grpId }) {
    // e.preventDefault();
    setLoading(true);
    try {
      const data = await axiosPut(`/group/${grpId}`, currentUser);
      console.log('user added into group', data);
      let updated = data.users.filter((user) => user._id === currentUser._id);
      console.log('updated', updated[0]);
      setCurrentUser(updated[0]);
      dispatch(setUser(updated[0]));
      setLoading(false);
    } catch (error) {
      console.error('Error joining group', error);
      setError(error);
      setLoading(false);
    }
    setLoading(false);
  }

  // Leave Group Function
  async function leaveGroup(grpId) {
    try {
      const data = await axiosPost(`/group/user/${grpId}`, currentUser);
      if (data) {
        setCurrentUser({ ...currentUser, groupId: null });

        dispatch(setUser({ ...currentUser, groupId: null }));
        setLoading(false);
      }
      setLoading(false);
      console.log('Data after user leave the group', data);
    } catch (error) {
      console.error('Error leaving group', error);
      setError(error);
      setLoading(false);
    }
  }

  if (loading) return <h2>Loading Group..............</h2>;

  if (currentUser.groupId !== null && group) {
    console.log(group);
    return (
      <Container>
        <Box sx={{ width: '100%', maxWidth: 500 }}>
          {error && (
            <Alert variant="outlined" severity="error">
              <AlertTitle>Error</AlertTitle>
              {typeof error === 'string'
                ? error
                : error?.message || 'Error getting group data'}
            </Alert>
          )}
          <Typography variant="h1" component="h1" color="primary" gutterBottom>
            {group.name.toUpperCase()}
          </Typography>

          <Typography variant="h3" component="div">
            Group Members
          </Typography>
          <hr />
          {group.users.map((user) => (
            <Container key={user._id}>
              <Typography variant="h6" component="h2">
                {user.name}
               ({user.email}) {currentUser._id === user._id ? '(me)' : ''} 
              </Typography>
            </Container>
          ))}
          <hr />
          <Button
            variant="contained"
            color="error"
            onClick={() => leaveGroup(group._id)}
          >
            Leave Group - {group.name}
          </Button>
        </Box>
      </Container>
    );
  }

  if (currentUser && currentUser.groupId === null) {
    return (
      <Container sx={{ margin: 2, gap: 2 }}>
        <GroupForm />
        <Box sx={{ width: '100%', maxWidth: 360 }}>
          <Typography
            variant="body1"
            component="h2"
            sx={{ marginTop: 4, gap: 2, fontSize: 20, fontWeight: 'bold' }}
          >
            {' '}
            Available Groups{' '}
          </Typography>
          <hr />
          <nav aria-label="main">
            {groupList &&
              currentUser.groupId === null &&
              groupList.map((group) => (
                <List key={group._id}>
                  <ListItem sx={{ border: 1 }}>
                    <>
                      <ListItemText primary={group.name} />{' '}
                      {currentUser && currentUser.groupId === null && (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => joinGroup({ grpId: group._id })}
                        >
                          Join the Group
                        </Button>
                      )}
                    </>
                  </ListItem>
                </List>
              ))}
          </nav>
        </Box>
      </Container>
    );
  }

  return <h2>No Group Available</h2>;
};

export default Group;
