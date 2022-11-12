import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools'

import './App.css';
import RegisterForm from '../forms/RegisterForm';
import LoginForm from '../forms/LoginForm';
import Home from '../home/Home';


const queryClient = new QueryClient();

function App() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    userID: "",
    username: "",
    email: "",
  })

  useEffect( () => {
    const stringUser = localStorage.getItem("user")
    if(stringUser !== null) {
      const newUser = JSON.parse(stringUser)
      const cloneUser = {
        userID: newUser.users_id,
        username: newUser.users_name,
        email: newUser.email
      }
      setUser(cloneUser)
    }
  }, [])
  
  const onChangeUser = (newUser) => {
    const cloneUser = {
      userID: newUser.users_id,
      username: newUser.users_name,
      email: newUser.email
    }
    setUser(cloneUser);
    navigate("/");
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Routes>
          <Route path="/" element={<Home user={user} onHandleChange={onChangeUser}/>} />
          <Route path="/login" element={<LoginForm onHandleChange={onChangeUser}/>} />
          <Route path="/register" element={<RegisterForm onHandleChange={onChangeUser} />} />
        </Routes>
      </div>
      {/* <ReactQueryDevtools  initialIsOpen={true}/> */}
    </QueryClientProvider>
  );
}

export default App;
