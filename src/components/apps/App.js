import { Routes, Route} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools'

import "./App.css";
import RegisterForm from "../forms/RegisterForm";
import LoginForm from "../forms/LoginForm";
import Home from "../home/Home";
import VerifyForm from "../forms/VerifyForm";

const queryClient = new QueryClient();

function App() {
  
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/login"
            element={<LoginForm/>}
          />
          <Route
            path="/register"
            element={<RegisterForm/>}
          />
          <Route path="/:id/verify/:token" element={<VerifyForm />} />
        </Routes>
      </div>
      <ReactQueryDevtools  initialIsOpen={false}/>
    </QueryClientProvider>
  );
}

export default App;
