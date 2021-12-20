import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { AuthContext } from '../../application/firebase/auth';
import { doSocialSignIn } from '../../application/firebase/firebaseFunctions';

const SignUp = () => {
  const { currentUser } = useContext(AuthContext);
  if (currentUser) {
    return <Navigate to="/group" />;
  }
  console.log('CUrrent User in SignUp:', currentUser);
  const socialSignOn = async (provider) => {
    try {
      await doSocialSignIn(provider);
      console.log('Signon current user:', currentUser);
    } catch (error) {
      alert(JSON.stringify(error));
    }
  };

  return (
    <Container>
      <Typography variant="h2" component="h1">
        Welcome to WashTastic
      </Typography>
      <Typography variant="inherit">
        To access the website, Please login to your google account.
      </Typography>
      <Button
        variant="contained"
        sx={{ margin: 10 }}
        onClick={() => {
          socialSignOn('google');
        }}
      >
        Sign in with Google
      </Button>
    </Container>
  );
};

export default SignUp;
