export interface Comment {
  id: number;
  text: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  comments: Comment[];
} 