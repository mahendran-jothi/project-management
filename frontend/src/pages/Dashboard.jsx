import Projects from "@/features/projects";
import { useEffect } from "react";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Dashboard | Project Management";
  }, []);
  return (
    <div className="">
      <Projects />
    </div>
  );
};

export default Dashboard;
