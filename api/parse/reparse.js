import parseMonitorDetails from "./monitorParse.js";

export default function parseByType(type, post) {
  switch (type) {
    case 'monitor':
      post.detail = parseMonitorDetails(post.title);
      // DEBUG
      // post.detail.debug = 'This was reparsed!';
      return post;
    case 'ssd-m2':
      return parseSsdM2Details(post.title);
    // TODO: etc...
  }
}