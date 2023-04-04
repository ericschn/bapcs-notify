import axios from 'axios';
import { useState, useEffect } from 'react';

export function PostList(props) {
  const [redditJson, setRedditJson] = useState('');
  let redditArr = [];

  useEffect(() => {
    axios.get('http://localhost:3000/fetch-new').then((res) => {
      for (let post of res.data) {
        redditArr.push(<li key={post}>{post}</li>);
        setRedditJson(redditArr);
      }
    });
  }, []);

  return (
    <div className="post-list">
      <ul>{redditJson}</ul>
    </div>
  );
}
