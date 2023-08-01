import './Post.css';
import { PostButtons } from './PostButtons';
import { PostDetail } from './PostDetail';

export function Post({ post }) {
  if (post.title.length > 50) {
    post.title = post.title.substring(0, 50) + '...';
  }

  // Calculate time since posting
  // TODO: make this a module, maybe use dayjs lib
  const timeDiff = Math.floor(Date.now() / 1000) - post.created;
  let timeAmount = 'minutes';
  let timeAgo = Math.floor(timeDiff / 60);
  if (timeAgo >= 2880) {
    timeAgo = Math.floor(timeAgo / 1440);
    timeAmount = 'days';
  } else if (timeAgo >= 120) {
    timeAgo = Math.floor(timeAgo / 60);
    timeAmount = 'hours';
  }
  if (timeAmount === 'days' && timeAgo >= 61) {
    timeAgo = Math.floor(timeAgo / 30);
    timeAmount = 'months';
  }

  return (
    <div className="post-container">
      <div className="post-content">
        <PostDetail post={post} />
      </div>

      <div className="post-bottom-info">
        <div className="post-time-ago">
          {timeAgo} {timeAmount} ago
        </div>

        <div className="post-domain">{post.domain}</div>
      </div>

      <PostButtons post={post} />
    </div>
  );
}
