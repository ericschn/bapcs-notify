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
    <div
      className={
        post.type === 'expired' || post.expired ? 'post expired' : 'post'
      }
    >
      <div className="post-top">
        <a className="post-title" href={post.link} target="_blank">
          {post.title}
        </a>
      </div>
      <div className="post-bottom">
        <div>
          {post.type} - ${Math.ceil(parseFloat(post.price))} - {post.domain}
        </div>
        <a href={'https://reddit.com/' + post.id} target="_blank">
          {post.id} reddit link
        </a>
        <span> - upvotes: {post.upvotes}</span>
        <div>
          {timeAgo} {timeAmount} ago - {post.created}
        </div>
      </div>
    </div>
  );
}
