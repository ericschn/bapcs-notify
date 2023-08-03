import menuIcon from '../assets/menu.svg';
import commentIcon from '../assets/comment.svg';
import shopIcon from '../assets/shop.svg';
import starIcon from '../assets/star.svg';

export function PostButtons({ post, descriptionSwap }) {
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
        <img src={menuIcon} onClick={descriptionSwap}/>
        <a href={redditLink} target="_blank">
          <img src={commentIcon} />
        </a>
        <img src={starIcon} />
        <a href={post.link} target="_blank">
          <img src={shopIcon} />
        </a>
      </div>
    </div>
  );
}
