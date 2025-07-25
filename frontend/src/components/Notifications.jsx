// src/components/Notifications.tsx
import { useEffect } from "react";
import toast from "react-hot-toast";
import socket from "../socket";
import "react-toastify/dist/ReactToastify.css";

const Notifications = () => {
  useEffect(() => {
    socket.on("project:created", (data) => {
      toast.success(data.message || "A new project was created");
    });

    socket.on("project:updated", (data) => {
      toast.success(data.message || "A project was updated");
    });

    socket.on("project:deleted", (data) => {
      toast.error(data.message || "A project was deleted");
    });

    return () => {
      socket.off("project:created");
      socket.off("project:updated");
      socket.off("project:deleted");
    };
  }, []);

  return null;
};

export default Notifications;
