import Notifications from "@/features/notifications";
import { useEffect } from "react";

const Notification = () => {
  useEffect(() => {
    document.title = "Project Management | Notification";
  }, []);
  return (
    <div>
      <Notifications />
    </div>
  );
};

export default Notification;
