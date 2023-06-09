export function PostDetail({ post }) {
  let type, detailTop, detailBot;


  // TODO: Module for detail formatting

  try {
    switch (post.type) {
      case 'monitor':
        type = 'Monitor';
        detailTop = ` ${post.detail.inches}" `;
        detailBot = `${post.detail.brand ? post.detail.brand : ''} ${
          post.detail.hRes ? `${post.detail.hRes}x` : ''
        }${post.detail.vRes} ${
          post.detail.panel ? post.detail.panel?.toUpperCase() : ''
        } ${post.detail.hz ? `${post.detail.hz}hz` : ''}`;
        break;

      default:
        type = post.type;
    }
  } catch {
    console.log('no detail');
  }

  return (
    <div className="post-detail">
      <a className="post-type" href={post.link} target="_blank">
        {type?.toUpperCase()}
      </a>
      {detailTop}
      {/* {post.detail ? Object.values(post.detail) : ''} */}
      <div className="detail-bot">{detailBot}</div>
    </div>
  );
}
