import { useContext } from 'react';
import { doSignOut } from '../../application/firebase/firebaseFunctions';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../application/firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../application/redux/actions/user';

const SignOut = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function handleSignOut(e) {
    console.log('Before Prevent');
    e.preventDefault();
    console.log('in SIgnout handleSIgnout', currentUser);

    doSignOut();
    setCurrentUser(null);
    dispatch(setUser(null));
    navigate('/login');
  }
  return (
    <div>
      <button type="button" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
};

export default SignOut;
