import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import "./App.css";
import RegisterForm from "../forms/RegisterForm";
import LoginForm from "../forms/LoginForm";
import Home from "../home/Home";
import VerifyForm from "../forms/VerifyForm";
import LoginGoogleSuccess from "../forms/GoogleSuccess";
import LoginGoogleFail from "../forms/GoogleFailure";
import { SocketContext, socket, SocketContextProvider } from "../socket/Socket";
import ResetPasswordForm from "../forms/ResetPasswordForm";
import EnterEmailForm from "../forms/EnterEmailForm";

const queryClient = new QueryClient();

function App() {
  return (
    <SocketContextProvider>
      <QueryClientProvider client={queryClient}>
        <div className="App" style={{ backgroundImage: "url(/body-bg.jpg)" }}>
          <Routes>
            <Route path="/*" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/:id/verify/:token" element={<VerifyForm />} />
            <Route
              path="/login/google/success/:token"
              element={<LoginGoogleSuccess />}
            />
            <Route path="/login/google/failure" element={<LoginGoogleFail />} />
            <Route path="/forgotpassword" element={<EnterEmailForm />} />
            <Route path="/resetpassword/:token" element={<ResetPasswordForm />} />
          </Routes>
        </div>
      </QueryClientProvider>
    </SocketContextProvider>
  );
}

export default App;
