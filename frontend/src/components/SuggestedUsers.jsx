import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'react-toast';
import axios from 'axios';
import useGetLoggedUserFollow from '@/hooks/useGetLoggedUserFollow';

const SuggestedUsers = () => {
    useGetLoggedUserFollow();
    const { suggestedUsers, loggedUserFollow } = useSelector(store => store.auth);
    const [isFollowing, setIsFollowing] = useState(false);
    console.log(loggedUserFollow, 'loggedUserFollow');
    
    const followOrUnfollow = (userId) => async () => {
        console.log(userId, 'userId');
        try {
            const res = await axios.post(`https://socialgram-backend-bwan.onrender.com/api/v1/user/followorunfollow/${userId}`, {}, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            console.log(res, 'followOrUnfollow');
            if(res.data.success){
                setIsFollowing(res.data.message === 'Unfollowed successfully' ? false : true);
                toast.success(res.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='my-10'>
            <div className='flex items-center justify-between text-sm'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
            {
                suggestedUsers.map((user) => {
                    return (
                      <div
                        key={user._id}
                        className="flex items-center justify-between my-5"
                      >
                        <div className="flex items-center gap-2">
                          <Link to={`/profile/${user?._id}`}>
                            <Avatar>
                              <AvatarImage
                                src={user?.profilePicture}
                                alt="post_image"
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                          </Link>
                          <div>
                            <h1 className="font-semibold text-sm">
                              <Link to={`/profile/${user?._id}`}>
                                {user?.username}
                              </Link>
                            </h1>
                            <span className="text-gray-600 text-sm">
                              {user?.bio || "Bio here..."}
                            </span>
                          </div>
                        </div>
    
                        <span
                          className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]"
                          onClick={followOrUnfollow(user?._id)}
                        >
                          {loggedUserFollow?.some(
                            (f) => f._id === user._id
                          )
                            ? "Unfollow"
                            : "Follow"}
                        </span>
                      </div>
                    );
                })
            }

        </div>
    )
}

export default SuggestedUsers