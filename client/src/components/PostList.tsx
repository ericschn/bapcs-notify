import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PostCard } from './PostCard';
import { PostFilter } from './PostFilter';
import { Post } from '../models/PostModel';

export function PostList() {
  const [posts, setPosts] = useState<React.JSX.Element[]>([]);
  const { typeFilter } = useParams();
  let postsArr: React.JSX.Element[] = [];
  let needData = true;

  useEffect(() => {
    if (needData) {
      axios.get(`${import.meta.env.VITE_API_URL}/posts`).then((res) => {
        for (let post of res.data) {
          postsArr.push(<PostCard key={post.id} post={post} />);
        }
        setPosts(postsArr);
      });
      needData = false;
    }
  }, []);

  return (
    <div className="post-list">
      <PostFilter currentFilter={typeFilter} />
      <div className="post-list-wrapper">
        {posts.filter((p) => p.props.post.type === typeFilter || !typeFilter)}
      </div>
    </div>
  );
}
