export function Post({ post }) {

  if (post.title.length > 80) {
    post.title = post.title.substring(0, 80) + '...';
  }

  return (
    <div className="post">
      <h3>{post.title}</h3>
      <p>{post.type}</p>
    </div>
  );
}
