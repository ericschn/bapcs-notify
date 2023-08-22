import menuIcon from '../assets/menu.svg';
import commentIcon from '../assets/comment.svg';
import shopIcon from '../assets/shop.svg';
import starIcon from '../assets/star.svg';
import { Post } from '../models/PostModel';

interface PostButtonsProps {
  post: Post;
  descriptionSwap: () => void;
}

export function PostButtons({ post, descriptionSwap }: PostButtonsProps) {
  // The four buttons at the bottom of a post card are:
  // hamburger menu: small modal with other options
  // link to reddit thread
  // favorite or save button
  // link to purchase site
  const userPref = { oldSite: 'old.' }; // TODO: site prefs
  const redditLink = `https://${userPref.oldSite}reddit.com${post.reddit.permalink}`;

  // console.log(post);

  return (
    <div className="post-buttons">
      <div className="post-buttons-container">
        <img src={menuIcon} onClick={descriptionSwap} />
        <a href={redditLink} target="_blank" className='tooltip-container'>
          <img src={commentIcon} />
          <span className="tooltip-text">reddit comments</span>
        </a>
        <img src={starIcon} />
        <a href={post.link} target="_blank" className='tooltip-container'>
          <img src={shopIcon} />
          <span className="tooltip-text">link to purchase</span>
        </a>
      </div>
    </div>
  );
}
