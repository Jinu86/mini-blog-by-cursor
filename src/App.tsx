import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Post, Comment } from './types';

// 더미 데이터
const initialPosts: Post[] = [
  { id: 1, title: '첫 번째 게시글', content: '첫 번째 게시글의 본문입니다.', comments: [{ id: 1, text: '첫 번째 댓글' }] },
  { id: 2, title: '두 번째 게시글', content: '두 번째 게시글의 본문입니다.', comments: [] },
  { id: 3, title: '세 번째 게시글', content: '세 번째 게시글의 본문입니다.', comments: [{ id: 2, text: '댓글 예시' }] },
  { id: 4, title: '네 번째 게시글', content: '네 번째 게시글의 본문입니다.', comments: [] },
  { id: 5, title: '다섯 번째 게시글', content: '다섯 번째 게시글의 본문입니다.', comments: [] },
  { id: 6, title: '여섯 번째 게시글', content: '여섯 번째 게시글의 본문입니다.', comments: [] },
];

// 헤더 컴포넌트
function Header() {
  return (
    <header className="py-4 border-b border-gray-300">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="w-24"></div> {/* 좌측 여백 */}
        <Link to="/" className="text-xl font-semibold text-all-black">미니 블로그</Link>
        <div className="w-24 flex justify-end">
          <Link
            to="/create"
            className="btn-black px-3 py-1 rounded-md text-sm"
          >
            글 작성하기
          </Link>
        </div>
      </div>
    </header>
  );
}

// 포스트 목록 컴포넌트
function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="max-w-[600px] mx-auto">
      {posts.map((post) => (
        <Link 
          key={post.id}
          to={`/post/${post.id}`}
          className="block border border-gray-300 rounded-lg p-4 mb-6 cursor-pointer hover:bg-gray-50"
        >
          <h2 className="text-base leading-none text-all-black">{post.title}</h2>
        </Link>
      ))}
    </div>
  );
}

// 포스트 상세 페이지 컴포넌트
function PostDetail({ posts, onAddComment }: { posts: Post[], onAddComment: (postId: number, text: string) => void }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find(p => p.id === Number(id));
  const [commentText, setCommentText] = useState('');

  if (!post) {
    return <div className="max-w-[600px] mx-auto">포스트를 찾을 수 없습니다.</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(post.id, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <button 
        className="mb-4 text-all-black hover:text-all-black flex items-center"
        onClick={() => navigate('/')}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        목록으로 돌아가기
      </button>

      <div className="border border-gray-300 rounded-lg p-4 mb-6">
        <h1 className="text-xl font-semibold mb-4 text-all-black">{post.title}</h1>
        <p className="text-all-black">{post.content}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3 text-all-black">댓글</h2>
        {post.comments.length > 0 ? (
          post.comments.map(comment => (
            <div key={comment.id} className="border border-gray-300 rounded-lg p-3 mb-2">
              <p className="text-all-black">{comment.text}</p>
            </div>
          ))
        ) : (
          <p className="text-all-black">아직 댓글이 없습니다.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
        />
        <button
          type="submit"
          className="btn-black px-4 py-2 rounded-r-lg"
        >
          등록
        </button>
      </form>
    </div>
  );
}

// 글 작성 페이지 컴포넌트
function CreatePost({ onAddPost }: { onAddPost: (title: string, content: string) => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onAddPost(title, content);
      navigate('/');
    }
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-all-black">글 작성하기</h2>
        <button 
          className="text-all-black hover:text-all-black"
          onClick={() => navigate('/')}
        >
          취소
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-all-black mb-1">
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            placeholder="제목을 입력하세요"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-all-black mb-1">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black min-h-[150px]"
            placeholder="내용을 입력하세요"
            required
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-all-black hover:bg-gray-50"
            onClick={() => navigate('/')}
          >
            취소
          </button>
          <button
            type="submit"
            className="btn-black px-4 py-2 rounded-md"
          >
            등록
          </button>
        </div>
      </form>
    </div>
  );
}

// 메인 앱 컴포넌트
function App() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  // 새 게시글 추가
  const handleAddPost = (title: string, content: string) => {
    const newPost: Post = {
      id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
      title,
      content,
      comments: [],
    };
    setPosts([newPost, ...posts]);
  };

  // 댓글 추가
  const handleAddComment = (postId: number, text: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newComment: Comment = {
          id: post.comments.length > 0 ? Math.max(...post.comments.map(c => c.id)) + 1 : 1,
          text,
        };
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
  };

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<PostList posts={posts} />} />
            <Route path="/post/:id" element={<PostDetail posts={posts} onAddComment={handleAddComment} />} />
            <Route path="/create" element={<CreatePost onAddPost={handleAddPost} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 