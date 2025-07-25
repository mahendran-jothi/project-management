import AppRoutes from "@/routes";
import { Toaster } from "react-hot-toast";
import Notifications from "@/components/Notifications";
function App() {
  return (
    <>
      <Notifications />
      <Toaster position="top-right" reverseOrder={false} />
      <AppRoutes />
    </>
  );
}

export default App;
