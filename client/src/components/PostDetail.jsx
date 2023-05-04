export function PostDetail({ post }) {


  return (
    <div className="detail">
      {/* DDR5 6200 32GB (2X16) */}
      {post.detail ? Object.values(post.detail) : ''}
    </div>
  );
}
