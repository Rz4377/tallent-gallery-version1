// UserPost.tsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContextApi";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useDarkMode } from "../components/theme-provider";
import EditablePostCard from "../components/EditablePostCard";

interface ProjectDescType {
  description: string;
  liveLink?: string;
  githubLink?: string;
  postImage?: string;
  postVideo?: string;
}

interface PostType {
  projectId: string;
  projectTitle: string;
  projectDesc: ProjectDescType;
}

export default function UserPost() {
  const auth = getAuth();
  const authContextValue = useContext(AuthContext);
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(true); // Loading state
  const { isDarkMode } = useDarkMode(); // Dark mode context

  if (!authContextValue) {
    return <>Error: AuthContext is undefined</>;
  }

  const { user, loading: authLoading } = authContextValue;

  useEffect(() => {
    const getPosts = async () => {
      if (authLoading) return;
      setLoading(true);

      const idToken = await auth.currentUser?.getIdToken();
      if (idToken) {
        try {
          const response = await axios.post(
            `https://api.tallentgallery.online/api/v1/user/userPost`,
            {},
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            }
          );
          if (response && response.data) {
            setUserPosts(response.data.response || response.data);
          }
        } catch (error) {
          setError("Internal server error or network issue");
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setError("Unable to authenticate user");
        setLoading(false);
      }
    };

    getPosts();
  }, [user, authLoading]);

  // Function to handle updating a post
  const handleUpdatePost = async (updatedPost: PostType) => {
    const idToken = await auth.currentUser?.getIdToken();
    if (idToken) {
      try {
        const response = await axios.put(
          `https://api.tallentgallery.online/api/v1/user/updatePost/${updatedPost.projectId}`,
          updatedPost,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
        if (response.status === 200) {
          // Update the post in the local state
          setUserPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.projectId === updatedPost.projectId ? updatedPost : post
            )
          );
        }
      } catch (error) {
        console.error("Error updating post:", error);
      }
    }
  };

  // Function to handle deleting a post
  const handleDeletePost = async (projectId: string) => {
    const idToken = await auth.currentUser?.getIdToken();
    if (idToken) {
      try {
        const response = await axios.delete(
          `https://api.tallentgallery.online/api/v1/user/deletePost/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
        if (response.status === 200) {
          // Remove the deleted post from the local state
          setUserPosts((prevPosts) =>
            prevPosts.filter((post) => post.projectId !== projectId)
          );
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Loading spinner or message
  }

  return (
    <>
      {!error ? (
        <div
          className={`p-4 ${
            isDarkMode ? "bg-gray-900" : "bg-gray-100"
          } min-h-screen flex flex-col items-center`}
        >
          <div className="w-1/2 max-w-3xl"> {/* Changed from w-full to w-1/2 */}
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <EditablePostCard
                  key={post.projectId}
                  post={post}
                  onUpdate={handleUpdatePost}
                  onDelete={handleDeletePost}
                />
              ))
            ) : (
              <div className="text-center text-lg">No posts found.</div>
            )}
          </div>
        </div>
      ) : (
        <div>Error: {error}</div>
      )}
    </>
  );
}