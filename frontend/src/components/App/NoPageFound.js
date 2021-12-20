import { useNavigate } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
const NoPageFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <Typography variant="h2" component="h2">
        404: page not found.
      </Typography>
      <Button variant="" color="primary" onClick={() => navigate(-1)}>
        Go Back Home
      </Button>
    </>
  );
};

export default NoPageFound;
