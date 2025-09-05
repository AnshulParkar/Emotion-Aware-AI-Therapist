export type Post = {
  id: number;
  author: string;
  content: string;
  reported: boolean;
};

export type Thread = {
  id: number;
  channel: string;
  title: string;
  posts: Post[];
};
