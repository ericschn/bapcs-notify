import { Post } from "../models/PostModel";

interface PostDetailProps {
  post: Post;
  showFullTitle: boolean;
}

export function PostDetail({ post, showFullTitle }: PostDetailProps) {
  let type = post.type;
  let detailKey: JSX.Element = <></>;
  let details = [];
  let dash = '—';
  let price = `$${Math.ceil(parseFloat(post.price))}`;

  const fullTitle = post.reddit.title.replace(/^\[.+?\]\s?/, '')

  // TODO: Module for detail formatting

  try {
    switch (post.type) {
      case 'monitor':
        type = 'Monitor';
        detailKey = (
          <span className="post-detail-key">
            {post.detail.inches ? post.detail.inches + '"' : ''}
          </span>
        );

        // brand name
        details.push(
          <td>
            <div className="post-info-label">brand</div>
            {post.detail.brand ? post.detail.brand : dash}
          </td>
        );

        // panel type
        details.push(
          <td>
            <div className="post-info-label">panel</div>
            {post.detail.panel ? post.detail.panel.toUpperCase() : dash}
          </td>
        );

        // freesync / gsync
        details.push(
          <td>
            <div className="post-info-label">sync</div>
            {post.detail.sync ? post.detail.sync : dash}
          </td>
        );

        // resolution
        if (post.detail.hRes && post.detail.vRes) {
          details.push(
            <td>
              <div className="post-info-label">resolution</div>
              {post.detail.hRes}x{post.detail.vRes}
            </td>
          );
        } else if (post.detail.vRes) {
          details.push(
            <td>
              <div className="post-info-label">resolution</div>
              {post.detail.vRes}p
            </td>
          );
        } else {
          details.push(
            <td>
              <div className="post-info-label">resolution</div>
              {dash}
            </td>
          );
        }

        // hz
        details.push(
          <td>
            <div className="post-info-label">refresh rate</div>
            {post.detail.hz ? post.detail.hz + ' Hz' : dash}
          </td>
        );

        // aspect ratio
        // details.push(
        //   <td>
        //     <div className="post-info-label">aspect ratio</div>
        //     {post.detail.aspect ? post.detail.aspect : dash}
        //   </td>
        // );

        break;

      default:
        type = post.type;
        showFullTitle = true;
    }
  } catch {
    console.log('error building post detail');
  }

  return (
    <div className="post-detail">
      <div>
        <span className="post-type">{type?.toUpperCase()}</span>
        {detailKey}
        <span className="post-price">{price}</span>
      </div>

      {showFullTitle ? fullTitle : (
        <div className="post-table">
          <table>
            <tbody>
              <tr>
                {details[0]}
                {details[1]}
                {details[2]}
              </tr>
              <tr>
                {details[3]}
                {details[4]}
                {details[5]}
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {/* {defaultTitle} */}
    </div>
  );
}
