import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

import './index.css';

import AuthLayout from './pages/auth/AuthLayout';
import SignupForm from './pages/auth/forms/SignupForm';
import SigninForm from './pages/auth/forms/SigninForm';
import RootLayout from './pages/root/RootLayout';
import {
  Home,
  Explore,
  Saved,
  AllUsers,
  CreatePost,
  EditPost,
  PostDetails,
  Profile,
  UpdateProfile,
} from './pages/root/pages';

import { AuthProvider } from './context/AuthContext';

const AuthProviderWrapper = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);

const router = createBrowserRouter([
  {
    element: <AuthProviderWrapper />,
    children: [
      // public routes
      {
        element: <AuthLayout />,
        children: [
          { path: '/sign-in', element: <SigninForm /> },
          { path: '/sign-up', element: <SignupForm /> },
        ],
      },

      // private routes
      {
        element: <RootLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: '/explore', element: <Explore /> },
          { path: '/saved', element: <Saved /> },
          { path: '/all-users', element: <AllUsers /> },
          { path: '/create-post', element: <CreatePost /> },
          { path: '/update-post/:id', element: <EditPost /> },
          { path: '/post/:id', element: <PostDetails /> },
          { path: '/profile/:id/*', element: <Profile /> },
          { path: '/update-profile/:id', element: <UpdateProfile /> },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <main className="flex h-screen">
      <RouterProvider router={router} />
      <Toaster />
    </main>
  );
};

export default App;
