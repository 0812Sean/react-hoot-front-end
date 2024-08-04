import { useState, createContext, useEffect } from 'react';
import { Routes, Route, useNavigate  } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import SignupForm from './components/SignupForm/SignupForm';
import SigninForm from './components/SigninForm/SigninForm';
import * as authService from './services/authService'
import HootList from './components/HootList/HootList';
import * as hootService from './services/hootService';
import HootDetails from './components/HootDetails/HootDetails';
import HootForm from './components/HootForm/HootForm';

const App = () => {
  const [user, setUser] = useState(authService.getUser())
  const [hoots, setHoots] = useState([]);
  const navigate = useNavigate();
  const handleAddHoot = async (hootFormData) => {
    const newHoot = await hootService.create(hootFormData);
    setHoots([newHoot, ...hoots]);
    navigate('/hoots');
  };
  const handleUpdateHoot = async (hootId, hootFormData) => {
    const updatedHoot = await hootService.update(hootId, hootFormData);
  
    setHoots(hoots.map((hoot) => (hootId === hoot._id ? updatedHoot : hoot)));
  
    navigate(`/hoots/${hootId}`);
  };
  const handleSignout = () => {
    authService.signout()
    setUser(null)

    useEffect(() => {
      const fetchAllHoots = async () => {
        const hootsData = await hootService.index();
        setHoots(hootsData);
      };
      if (user) fetchAllHoots();
    }, [user]);
  }

  const handleDeleteHoot = async (hootId) => {
    console.log('hootId', hootId);
    setHoots(hoots.filter((hoot) => hoot._id !== hootId));
    navigate('/hoots');
  };

  return (
    <>
      <NavBar user={user} handleSignout={handleSignout}/>
      <h1>Hello world!</h1>
      <Routes>
        {user ? (
          // Protected Routes:
          <>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/hoots" element={<HootList hoots={hoots} />} />
            <Route path="/hoots/:hootId"   element={<HootDetails handleDeleteHoot={handleDeleteHoot} />} />
            <Route path="/hoots/new" element={<HootForm handleAddHoot={handleAddHoot} />} />
            <Route path="/hoots/:hootId/edit"   element={<HootForm handleUpdateHoot={handleUpdateHoot} />}
            />

          </>
        ) : (
          // Public Route:
          <Route path="/" element={<Landing />} />
        )}
        <Route path="/signup" element={<SignupForm setUser={setUser} />} />
        <Route path="/signin" element={<SigninForm setUser={setUser} />} />
      </Routes>
    </>
  )
}

export default App




