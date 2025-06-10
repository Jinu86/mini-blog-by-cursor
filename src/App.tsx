import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

// 타입 정의
interface Comment {
  id: number;
  text: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  comments: Comment[];
}

// 더미 데이터
const initialPosts: Post[] = [
  { id: 1, title: '첫 번째 게시글', content: '첫 번째 게시글의 본문입니다.', comments: [{ id: 1, text: '첫 번째 댓글입니다.' }] },
  { id: 2, title: '두 번째 게시글', content: '두 번째 게시글의 본문입니다.', comments: [] },
  { id: 3, title: '세 번째 게시글', content: '세 번째 게시글의 본문입니다.', comments: [{ id: 2, text: '댓글 예시입니다.' }] },
  { id: 4, title: '네 번째 게시글', content: '네 번째 게시글의 본문입니다.', comments: [] },
  { id: 5, title: '다섯 번째 게시글', content: '다섯 번째 게시글의 본문입니다.', comments: [] },
  { id: 6, title: '여섯 번째 게시글', content: '여섯 번째 게시글의 본문입니다.', comments: [] },
];

// 헤더 컴포넌트
function Header() {
  return (
    <header className="py-4 border-b border-black">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="w-24"></div> {/* 좌측 여백 */}
        <h1 className="text-xl font-semibold" style={{ color: 'black' }}>미니 블로그</h1>
        <div className="w-24 flex justify-end">
          <Link
            to="/create"
            className="rounded-lg py-1 px-3 text-sm"
            style={{ backgroundColor: 'black', color: 'white' }}
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
          style={{ 
            display: 'block',
            border: '1px solid black',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1rem',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          <h2 style={{ fontSize: '1rem', lineHeight: '1', color: 'black' }}>{post.title}</h2>
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
    return <div className="max-w-[600px] mx-auto" style={{ color: 'black' }}>포스트를 찾을 수 없습니다.</div>;
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
        className="mb-4 flex items-center"
        style={{ color: 'black', background: 'none', border: 'none', cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span style={{ color: 'black' }}>목록으로 돌아가기</span>
      </button>

      <div style={{ 
        border: '1px solid black',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '1.5rem'
      }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'black' }}>{post.title}</h1>
        <p style={{ color: 'black' }}>{post.content}</p>
      </div>

      <div className="mb-6">
        <h2 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.75rem', color: 'black' }}>댓글</h2>
        {post.comments.length > 0 ? (
          post.comments.map(comment => (
            <div key={comment.id} style={{ 
              border: '1px solid black',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              marginBottom: '0.5rem'
            }}>
              <p style={{ color: 'black' }}>{comment.text}</p>
            </div>
          ))
        ) : (
          <p style={{ color: 'black' }}>아직 댓글이 없습니다.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="댓글을 입력하세요"
          style={{ 
            flex: '1',
            border: '1px solid black',
            borderTopLeftRadius: '0.5rem',
            borderBottomLeftRadius: '0.5rem',
            padding: '0.5rem 0.75rem',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          style={{ 
            backgroundColor: 'black',
            color: 'white',
            padding: '0.5rem 1rem',
            borderTopRightRadius: '0.5rem',
            borderBottomRightRadius: '0.5rem',
            border: 'none'
          }}
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
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'black' }}>글 작성하기</h2>
        <button 
          style={{ color: 'black', background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          취소
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'black', marginBottom: '0.25rem' }}>
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ 
              width: '100%',
              border: '1px solid black',
              borderRadius: '0.5rem',
              padding: '0.5rem 0.75rem',
              outline: 'none'
            }}
            placeholder="제목을 입력하세요"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="content" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'black', marginBottom: '0.25rem' }}>
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ 
              width: '100%',
              border: '1px solid black',
              borderRadius: '0.5rem',
              padding: '0.5rem 0.75rem',
              outline: 'none',
              minHeight: '150px'
            }}
            placeholder="내용을 입력하세요"
            required
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            style={{ 
              padding: '0.5rem 1rem',
              border: '1px solid black',
              borderRadius: '0.375rem',
              color: 'black',
              marginRight: '0.5rem',
              background: 'white',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            취소
          </button>
          <button
            type="submit"
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: 'black',
              color: 'white',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer'
            }}
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
      <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
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