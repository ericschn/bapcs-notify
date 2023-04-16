import axios from 'axios';
import { useState, useEffect } from 'react';
import { Post } from './Post';

export function PostList(props) {
  const [redditJson, setRedditJson] = useState([]);
  let postsArr = [];

  useEffect(() => {
    axios.get('http://localhost:3000/posts').then((res) => {
      for (let post of res.data) {
        postsArr.push(<Post key={post.id} post={post} />);
        
      }
      console.log(postsArr[0]);
      setRedditJson(postsArr);
    });
  }, []);

  return (
    <div className="post-list">
      {redditJson}
    </div>
  );
}
