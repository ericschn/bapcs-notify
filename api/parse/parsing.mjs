export default function parseRedditJson(posts) {
  let result = [];
  for (let post of posts) {
    let newPost = {
      id: post.data.id,
      created: post.data.created_utc,
      title: shortenRedditPostTitle(post.data.title),
      link: post.data.url,
      domain: post.data.domain,
      price: parsePrice(post.data.title),
      type: post.data.link_flair_css_class,
      detail: parseTypeDetail(post.data),
      reddit: parseRedditInfo(post.data),
      upvotes: post.data.ups,
    };

    result.push(newPost);
  }
  return result;
}

function shortenRedditPostTitle(title) {
  return title.replace(/\[.*\]/, '').replace(/[-[{(\s\u2013]*?\$.*$/, '');
}

function parsePrice(title) {
  // TODO: general parsing refactor
  try {
    return parseFloat(
      title
        .match(/\$\s?[\d\.,]+/)[0]
        .substring(1)
        .replace(',', '')
    );
  } catch {
    return 0;
  }
}

function parseTypeDetail(post) {
  const type = post.link_flair_css_class;
  switch (type.toLowerCase()) {
    // TODO: parsing for types
    case 'monitor':
      return { hz: 144, panel: 'ips' };
    case 'ram':
      return { ram_speed: 6400, ram_ddr: 'DDR5' };
    case 'cpu':
      return { cpu_brand: 'amd', cpu_cores: 16 };
    case 'gpu':
      return { gpu_brand: 'nvidia', gpu_memory: 12 };
    default:
      return null;
  }
}

function parseRedditInfo(post) {
  return {
    title: post.title,
    permalink: post.permalink,
    upvotes: post.ups,
    over_18: post.over_18,
    spoiler: post.spoiler,
    thumbnail: post.thumbnail,
  };
}
