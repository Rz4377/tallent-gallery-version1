// Posts.tsx
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import ImageWithLoader from '../components/ImageWithLoader';
import VideoWithLoader from '../components/VideoWithLoader';

export default function Posts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.tallentgallery.online/api/v1/user/feed?page=${pageNumber}&limit=10`
      );
      const newPosts = response.data.data; // Updated line
      if (Array.isArray(newPosts)) {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);

        if (newPosts.length === 0 || newPosts.length < 10) {
          setHasMore(false);
        }
      } else {
        console.error('Invalid data format:', newPosts);
        setHasMore(false);
      }
    } catch (error: any) {
      console.error('Error fetching posts:', error.message || error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    });
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef.current, hasMore]);

  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen flex justify-center">
      <div className=" w-1/2 max-w-4xl"> {/* This container will limit the width */}
        {/* Render posts */}
        {posts.map((post) => (
          <div
            key={post.projectId}
            className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-md shadow-md"
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
              {post.projectTitle}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {post.description}
            </p>
            {post.postImage && (
              <ImageWithLoader
                src={post.postImage}
                alt={post.projectTitle}
              />
            )}
            {post.postVideo && (
              <VideoWithLoader
                src={post.postVideo}
                poster={post.postImage}
              />
            )}
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Posted by {post.userName} on{' '}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
  
        {/* Loading Indicator */}
        {loading && (
          <div className="text-center py-4">
            <div className="loader animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto" />
          </div>
        )}
  
        {/* Load More Trigger */}
        <div ref={loadMoreRef} style={{ height: '1px' }} />
  
        {!hasMore && !loading && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            No more posts to display
          </div>
        )}
      </div>
    </div>
  );
}