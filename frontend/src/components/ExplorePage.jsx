import axios from "axios";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"; // Assuming you're using Radix UI

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    axios
      .get(`https://socialgram-backend-bwan.onrender.com/api/v1/post/explorePosts`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          setPosts(res?.data?.posts);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="pl-60 pr-32 pt-10 min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
          {posts.map((post) => (
            <Dialog key={post.id}>
              <DialogTrigger asChild>
                <div
                  className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="flex items-center p-3">
                    <img
                      src={post.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <span className="font-semibold">{post.username}</span>
                  </div>
                  <img
                    src={post.image}
                    alt="post"
                    className="w-full h-64 object-cover"
                  />
                  <p className="p-3 text-sm text-gray-700">{post.caption}</p>
                </div>
              </DialogTrigger>

              {selectedPost && selectedPost.id === post.id && (
                <DialogContent className="max-w-3xl p-6 bg-white">
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={selectedPost.image}
                      alt="full-post"
                      className="w-full md:w-1/2 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={selectedPost.avatar}
                          className="w-10 h-10 rounded-full"
                          alt="user"
                        />
                        <span className="font-bold">{selectedPost.username}</span>
                      </div>

                      <p className="text-sm mb-3">{selectedPost.caption}</p>

                      {/* Dummy Likes */}
                      <p className="text-sm text-gray-600 mb-3">
                        ❤️ Liked by <b>john_doe</b> and <b>42 others</b>
                      </p>

                      {/* Dummy Comments */}
                      <div className="text-sm">
                        <p><b>alice</b> Nice shot!</p>
                        <p><b>mark22</b> 🔥🔥🔥</p>
                        <p><b>emma_dev</b> Love the colors.</p>
                      </div>

                      {/* Dummy Tags */}
                      <div className="mt-4">
                        <span className="text-xs text-blue-500">#travel</span>{" "}
                        <span className="text-xs text-blue-500">#sunset</span>{" "}
                        <span className="text-xs text-blue-500">#photography</span>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              )}
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
