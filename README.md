# 🧪 Project Setup Instructions

This is a full-stack project containing:

- **Backend**: [NestJS](https://nestjs.com/)
- **Frontend**: [React](https://reactjs.org/)

---

## 📁 Project Structure

```
/project-root
  ├── /backend       ← NestJS backend
  └── /frontend      ← React frontend
```

---

## 🔧 Backend Setup (NestJS)

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configuration is handled using TypeScript config files:

   - **MongoDB URI** is set in `src/config/database.config.ts`:

     ```ts
     export default () => ({
       uri: "mongodb+srv://project-management-user:kOjgopFvAdULllIO@project-management-clus.kryuiat.mongodb.net/project-management?retryWrites=true&w=majority&appName=project-management-cluster",
     });
     ```

   - **JWT Configuration** is in `src/config/jwt.config.ts`:

     ```ts
     export default () => ({
       secret:
         "9971558cbce6a56e5c3ca2de430cfd64678d2707fbfe71453189c5dff1a36aa0",
       signOptions: { expiresIn: "1d" },
     });
     ```

   - **Server Port** is set in `src/config/port.config.ts`:

     ```ts
     export default () => ({
       port: 3000,
     });
     ```

4. Run the backend server in development mode:

   ```bash
   npm run start:dev
   ```

   The API will be available at: `http://localhost:3000`

---

## 💻 Frontend Setup (React)

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `frontend` directory and add the backend URL:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. Start the frontend development server:

   ```bash
   npm run dev
   ```

   The frontend will be running at: `http://localhost:5173`

---

## ✅ Local URLs

| Service  | URL                   |
| -------- | --------------------- |
| Backend  | http://localhost:3000 |
| Frontend | http://localhost:5173 |

---

## 📝 Notes

- Config values like DB URI, port, and JWT secret are managed via `.ts` config files instead of `.env`.
