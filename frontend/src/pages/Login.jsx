import LoginForm from "@/features/auth";
import { useEffect } from "react";

const Login = () => {
  useEffect(() => {
    document.title = "Project Management | Login";
  }, []);
  return (
    <div className="lg:container mx-auto p-[80px]">
      <LoginForm />
    </div>
  );
};

export default Login;
