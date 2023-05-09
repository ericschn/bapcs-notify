import {PostDetail} from './PostDetail.jsx';

export function Post2({ post }) {
  if (post.title.length > 90) {
    post.title = post.title.substring(0, 90).trim() + '...';
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

  // DEBUG
  // console.log(post);

  return (
    <div
      className={
        post.expired ? 'post2 expired' : 'post2'
      }
    >
      <div className="post-top">


          {/* DDR5 6200 32GB (2X16) */}
          {/* {post.detail ? Object.values(post.detail) : ''} */}
          <PostDetail post={post} />

        <div className="price">${Math.ceil(post.price)}</div>
      </div>

      <div className="post-bottom">
        <div>{post.title}</div>
        <a href={'https://reddit.com/' + post.id} target="_blank">
          {'reddit.com/' + post.id}
        </a>
        <span> - {post.upvotes}</span>
        <div className="post-domain">{post.domain}</div>
        <div className="time-ago">
          {timeAgo} {timeAmount} ago
        </div>
      </div>
    </div>
  );
}
