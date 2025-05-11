import getUnsplashImages from "../utils/unsplash.js";

export const explorePosts = async (req, res) => {
  try {
    const avatars = await getUnsplashImages("portrait", 20); // profile-like photos
    const posts = await getUnsplashImages("lifestyle", 20); // post-style photos

    const dummyPosts = Array.from({ length: 20 }).map((_, i) => ({
      id: i + 1,
      username: `user_${i + 1}`,
      avatar: avatars[i]?.urls?.small,
      image: posts[i]?.urls?.regular,
      caption: [
        "Chillin' out here 😎",
        "Perfect sunset 🌇",
        "Code + Coffee = Bliss ☕💻",
        "Living the moment 🌊",
        "No filter needed ✨",
      ][i % 5],
    }));
    res.status(200).json({
      message: "Posts fetched successfully",
      success: true,
      posts: dummyPosts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
