import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
//   const { user: loggedInUser } = useSelector(store => store.auth);

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      axios
        .get(`https://socialgram-backend-bwan.onrender.com/api/v1/user/searchUsers?q=${query}`, {
          withCredentials: true
        })
        .then(res => {
          if (res.data.success) {
            setUsers(res.data.users);
          }
        })
        .catch(err => console.error(err));
    }, 400); // debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring focus:border-blue-300"
      />
      <div className="bg-white rounded-md shadow-md">
        {users.length > 0 ? (
          users.map((user) => (
            <Link
              to={`/profile/${user._id}`}
              key={user._id}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 border-b"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.profilePicture} alt={user.username} />
                <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-sm font-medium">{user.username}</div>
            </Link>
          ))
        ) : query.length > 0 ? (
          <p className="text-sm text-center p-3 text-gray-500">No users found</p>
        ) : null}
      </div>
    </div>
  );
};

export default SearchComponent;
