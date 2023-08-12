export interface Post {
  id: string;
  created: number;
  title: string;
  link: string;
  domain: string;
  price: string;
  type: string;
  detail?: any;
  reddit: {
    title: string;
    permalink: string;
    upvotes: number;
    over_18: boolean;
    spoiler: boolean;
    thumbnail: string;
  };
}