import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import "./App.css";
import React from "react";
import RegisterForm from "../forms/RegisterForm";
import LoginForm from "../forms/LoginForm";
import Home from "../home/Home";
import VerifyForm from "../forms/VerifyForm";
import LoginGoogleSuccess from "../forms/GoogleSuccess";
import LoginGoogleFail from "../forms/GoogleFailure";
import Group from "../group/Group";
import MyGroup from "../group/MyGroup/MyGroup";
import CreateGroup from "../group/CreateGroup/CreateGroup";
import GroupDetail from "../group/GroupDetail/GroupDetail";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/:id/verify/:token" element={<VerifyForm />} />
        <Route
          path="/login/google/success/:token"
          element={<LoginGoogleSuccess />}
        />
        <Route path="/login/google/failure" element={<LoginGoogleFail />} />
        <Route path="/group" element={<Group />}>
          <Route index element={<MyGroup />} />
          <Route path="create" element={<CreateGroup />} />
          <Route path=":groupId" element={<GroupDetail />} />
        </Route>
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
