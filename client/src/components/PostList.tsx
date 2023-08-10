import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Post } from './Post';
import { PostFilter } from './PostFilter';
import { Post2 } from './Post2';

export function PostList() {
  const [posts, setPosts] = useState([]);
  // const [typeFilter, setTypeFilter] = useState('');
  const { typeFilter } = useParams();
  let postsArr = [];
  let needData = true;

  // if (typeFilter !== '') {
  //   console.log('new filter: ' + typeFilter);
  // }

  useEffect(() => {
    if (needData) {
      axios.get(`${import.meta.env.VITE_API_URL}/posts`).then((res) => {
        for (let post of res.data) {
          postsArr.push(<Post key={post.id} post={post} />);
          // postsArr.push(<Post2 key={post.id} post={post} />);
        }
        setPosts(postsArr);
      });
      needData = false;
    }
  }, []);

  return (
    <div className="post-list">
      <PostFilter currentFilter={typeFilter}/>
      <div className="post-list-wrapper">
        {posts.filter((p) => p.props.post.type === typeFilter || !typeFilter)}
      </div>
    </div>
  );
}
