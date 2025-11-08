import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { usePostStore } from '../stores/postStore';
import PostCard from '../components/PostCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { posts, generatePost, getUserPosts, isLoading, error } = usePostStore();
  const [filter, setFilter] = useState('draft');
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    getUserPosts({ status: filter });
  }, [filter, user, navigate]);

  const handleGeneratePost = async () => {
    try {
      await generatePost();
      setShowNewPostForm(false);
      getUserPosts({ status: 'draft' });
    } catch (err) {
      console.error('Failed to generate post:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--white)', borderBottom: '1px solid var(--gray-200)', padding: 'var(--spacing-lg)' }}>
        <div className="container flex-between">
          <div>
            <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>AI-SMART Dashboard</h1>
            <p className="text-muted" style={{ marginBottom: 0 }}>Welcome, {user?.name}!</p>
          </div>
          <div className="flex gap-md">
            <button className="btn-secondary" onClick={() => navigate('/settings')}>
              Settings
            </button>
            <button className="btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ padding: 'var(--spacing-xl) var(--spacing-md)' }}>
        {/* Action Bar */}
        <div className="flex-between" style={{ marginBottom: 'var(--spacing-xl)', gap: 'var(--spacing-lg)' }}>
          <div>
            <h2>Your Posts</h2>
          </div>
          <button className="btn-primary btn-lg" onClick={handleGeneratePost} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Generating...
              </>
            ) : (
              '+ Generate New Post'
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-md" style={{ marginBottom: 'var(--spacing-lg)' }}>
          {['draft', 'posted', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                border: 'none',
                borderBottom: filter === status ? '2px solid var(--primary)' : '1px solid var(--gray-300)',
                backgroundColor: 'transparent',
                color: filter === status ? 'var(--primary)' : 'var(--gray-600)',
                fontWeight: filter === status ? '600' : '500',
                cursor: 'pointer',
                fontSize: 'var(--font-size-base)',
                textTransform: 'capitalize',
              }}
            >
              {status === 'all' ? 'All Posts' : `${status.charAt(0).toUpperCase() + status.slice(1)}`}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-lg)' }}>
            {error}
          </div>
        )}

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-2">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onRefresh={() => getUserPosts({ status: filter })} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-3xl)' }}>
            <h3 style={{ color: 'var(--gray-500)', marginBottom: 'var(--spacing-md)' }}>
              {filter === 'draft' ? 'No draft posts yet' : 'No posts found'}
            </h3>
            <p className="text-muted" style={{ marginBottom: 'var(--spacing-lg)' }}>
              {filter === 'draft'
                ? 'Generate your first AI-powered post to get started!'
                : 'Try generating a new post or change the filter.'}
            </p>
            {filter === 'draft' && (
              <button className="btn-primary" onClick={handleGeneratePost} disabled={isLoading}>
                Generate First Post
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
