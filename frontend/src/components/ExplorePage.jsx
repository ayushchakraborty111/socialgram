import axios from "axios";
import React, { useEffect, useState } from "react";

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://socialgram-backend-bwan.onrender.com/api/v1/post/explorePosts`, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setPosts(res?.data?.posts);
        }
        setLoading(false);
      })
      .catch((err) => {console.error(err); setLoading(false);});
  }, []);
  return (
    <div className="pl-60 pr-32 pt-10 min-h-screen bg-gray-50"> {/* adjust pr if needed for right sidebar */}
    {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="flex items-center p-3">
              <img src={post.avatar} alt="avatar" className="w-10 h-10 rounded-full mr-3" />
              <span className="font-semibold">{post.username}</span>
            </div>
            <img src={post.image} alt="post" className="w-full h-64 object-cover" />
            <p className="p-3 text-sm text-gray-700">{post.caption}</p>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default ExplorePage;
