export function Post({ post }) {
  if (post.title.length > 80) {
    post.title = post.title.substring(0, 80) + '...';
  }

  // Calculate time since posting
  // TODO: make this a module, maybe use dayjs lib
  const timeDiff = Math.floor(Date.now() / 1000) - post.created;
  let timeAmount = 'minutes';
  let timeAgo = Math.floor(timeDiff / 60);
  if (timeAgo >= 120) {
    timeAgo = Math.floor(timeAgo / 60);
    timeAmount = 'hours';
  }

  return (
    <div className={post.type === 'expired' ? 'post expired' : 'post'}>
      <a className="post-title" href={post.link} target="_blank">
        {post.title}
      </a>
      <p>
        {post.type} - ${post.price} - {post.domain}
      </p>
      <a href={'https://reddit.com/' + post.id} target="_blank">
        reddit link
      </a>
      <span> - upvotes: {post.reddit.upvotes}</span>
      <p>
        {timeAgo} {timeAmount} ago
      </p>
    </div>
  );
}
