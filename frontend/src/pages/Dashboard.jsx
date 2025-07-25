import Projects from "@/features/projects";
import { useEffect } from "react";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Project Management | Dashboard";
  }, []);
  return (
    <div className="">
      <Projects />
    </div>
  );
};

export default Dashboard;
