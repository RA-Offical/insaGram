import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { SigninForm, SignupForm } from "./_auth/forms";
import { Toaster } from "@/components/ui/toaster";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";

const Home = lazy(() => import("./_root/pages/Home"));
const Explore = lazy(() => import("./_root/pages/Explore"));
const Saved = lazy(() => import("./_root/pages/Saved"));
const AllUsers = lazy(() => import("./_root/pages/AllUsers"));
const CreatePost = lazy(() => import("./_root/pages/CreatePost"));
const EditPost = lazy(() => import("./_root/pages/EditPost"));
const PostDetails = lazy(() => import("./_root/pages/PostDetails"));
const Profile = lazy(() => import("./_root/pages/Profile"));
const UpdateProfile = lazy(() => import("./_root/pages/UpdateProfile"));

function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* private routes */}
        <Route path="/" element={<RootLayout />}>
          <Route
            index
            element={
              <Suspense fallback={<div>Loading Home...</div>}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/explore"
            element={
              <Suspense fallback={<div>Loading Explore</div>}>
                <Explore />
              </Suspense>
            }
          />
          <Route
            path="/saved"
            element={
              <Suspense fallback={<div>Loading Saved</div>}>
                <Saved />
              </Suspense>
            }
          />
          <Route
            path="/all-users"
            element={
              <Suspense fallback={<div>Loading All users</div>}>
                <AllUsers />
              </Suspense>
            }
          />
          <Route
            path="/create-post"
            element={
              <Suspense fallback={<div>Loading Create Post</div>}>
                <CreatePost />
              </Suspense>
            }
          />
          <Route
            path="/update-post/:id"
            element={
              <Suspense fallback={<div>Loading Update Post</div>}>
                <EditPost />
              </Suspense>
            }
          />
          <Route
            path="/posts/:id"
            element={
              <Suspense fallback={<div>Loading Post Details</div>}>
                <PostDetails />
              </Suspense>
            }
          />
          <Route
            path="/profile/:id/*"
            element={
              <Suspense fallback={<div>Loading Profile</div>}>
                <Profile />
              </Suspense>
            }
          />
          <Route
            path="/update-profile/:id"
            element={
              <Suspense fallback={<div>Loading Update Profile</div>}>
                <UpdateProfile />
              </Suspense>
            }
          />
        </Route>
      </Routes>

      <Toaster />
    </main>
  );
}

export default App;
