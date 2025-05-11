import { setLoggedUserFollow } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetLoggedUserFollow = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/getLoggedUserFollowers`, { withCredentials: true });
                console.log(res, 'getLoggedUserFollowers');
                if (res.data.success) { 
                    dispatch(setLoggedUserFollow(res.data.following));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSuggestedUsers();
    }, []);
};
export default useGetLoggedUserFollow;