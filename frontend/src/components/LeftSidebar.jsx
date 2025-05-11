import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  AArrowUpIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setChatUsers } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user, chatUsers, suggestedUsers } = useSelector(
    (store) => store.auth
  );
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1100);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 1100);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 1100);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(
      setChatUsers(
        suggestedUsers.filter((user) =>
          user.messages?.some((message) => message.isRead === false)
        )
      )
    );
  }, [suggestedUsers]);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/logout`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
      dispatch(setChatUsers(null));
    } else if (textType === "Explore") {
      navigate("/explore");
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    // {icon: <AArrowUpIcon />, text: "Collaboration" },
    { icon: <LogOut />, text: "Logout" },
  ];
  return (
    <>
      {/* Toggle Button */}
      <button
        className={`fixed top-4 left-4 z-30 bg-white border border-gray-300 rounded-full p-1 shadow-md transition-transform duration-300 ${
          isCollapsed ? "block" : "hidden"
        }`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <ChevronRight size={20} />
      </button>

      {/* Sidebar Wrapper */}
      <div
        className={`fixed top-0 z-20 left-0 h-screen overflow-y-scroll bg-white border-r border-gray-300 transition-all duration-300
          ${isCollapsed ? "w-0 overflow-hidden" : "w-60 min-w-[240px] px-4"}
        `}
      >
        {/* === ORIGINAL SIDEBAR START (your untouched code) === */}
        <div className="flex flex-col">
          <h1 className="my-8 pl-3 font-bold text-xl">LOGO</h1>
          <div>
            {sidebarItems.map((item, index) => {
              return (
                <div
                  onClick={() => sidebarHandler(item.text)}
                  key={index}
                  className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
                >
                  {item.icon}
                  <span>{item.text}</span>
                  {item.text === "Notifications" &&
                    likeNotification.length > 0 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            size="icon"
                            className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
                          >
                            {likeNotification.length}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div>
                            {likeNotification.length === 0 ? (
                              <p>No new notification</p>
                            ) : (
                              likeNotification.map((notification) => {
                                return (
                                  <div
                                    key={notification.userId}
                                    className="flex items-center gap-2 my-2"
                                  >
                                    <Avatar>
                                      <AvatarImage
                                        src={
                                          notification.userDetails
                                            ?.profilePicture
                                        }
                                      />
                                      <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm">
                                      <span className="font-bold">
                                        {notification.userDetails?.username}
                                      </span>{" "}
                                      liked your post
                                    </p>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  {item.text === "Messages" && chatUsers?.length > 0 ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
                        >
                          {chatUsers?.length}
                        </Button>
                      </PopoverTrigger>
                    </Popover>
                  ) : (
                    <div></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <CreatePost open={open} setOpen={setOpen} />
        {/* === ORIGINAL SIDEBAR END === */}
      </div>
      {!isCollapsed && (
        <button
          className="fixed top-4 left-64 z-30 bg-white border border-gray-300 rounded-full p-1 shadow-md transition-transform duration-300"
          onClick={() => setIsCollapsed(true)}
        >
          <ChevronLeft size={20} />
        </button>
      )}
    </>
  );
};

export default LeftSidebar;
