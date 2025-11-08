import { useState } from 'react';
import { usePostStore } from '../stores/postStore';

export default function PostCard({ post, onRefresh }) {
  const { updatePost, approveAndPost, deletePost, isLoading } = usePostStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState(post.editedCaption || post.caption);
  const [editedHashtags, setEditedHashtags] = useState((post.editedHashtags || post.hashtags).join(' '));
  const [suggestedTopic, setSuggestedTopic] = useState('');

  const handleSaveEdit = async () => {
    try {
      await updatePost(post._id, {
        caption: editedCaption,
        hashtags: editedHashtags.split(' ').filter((tag) => tag.trim()),
      });
      setIsEditing(false);
      onRefresh();
    } catch (err) {
      console.error('Failed to update post:', err);
    }
  };

  const handleApproveAndPost = async () => {
    try {
      await approveAndPost(post._id);
      onRefresh();
    } catch (err) {
      console.error('Failed to post:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post._id);
        onRefresh();
      } catch (err) {
        console.error('Failed to delete post:', err);
      }
    }
  };

  const handleRegenerate = () => {
    // TODO: Implement regenerate with suggested topic
    console.log('Regenerate with topic:', suggestedTopic);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'var(--warning)';
      case 'posted':
        return 'var(--success)';
      case 'failed':
        return 'var(--error)';
      default:
        return 'var(--gray-500)';
    }
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                backgroundColor: getStatusColor(post.status),
                color: 'white',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '600',
                textTransform: 'capitalize',
              }}
            >
              {post.status}
            </span>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-500)' }}>
              {new Date(post.generatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Image Preview */}
      {post.imageUrl && (
        <div style={{ marginBottom: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--gray-100)', maxHeight: '200px' }}>
          <img
            src={post.imageUrl}
            alt="Post"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Content */}
      <div className="card-body">
        {isEditing ? (
          <>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '500' }}>
              Caption
            </label>
            <textarea
              value={editedCaption}
              onChange={(e) => setEditedCaption(e.target.value)}
              style={{ width: '100%', marginBottom: 'var(--spacing-lg)' }}
            />

            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '500' }}>
              Hashtags (space-separated)
            </label>
            <input
              type="text"
              value={editedHashtags}
              onChange={(e) => setEditedHashtags(e.target.value)}
              placeholder="#hashtag1 #hashtag2"
              style={{ width: '100%', marginBottom: 'var(--spacing-lg)' }}
            />

            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '500' }}>
              Suggest a topic to regenerate
            </label>
            <input
              type="text"
              value={suggestedTopic}
              onChange={(e) => setSuggestedTopic(e.target.value)}
              placeholder="e.g., AI trends, productivity tips"
              style={{ width: '100%', marginBottom: 'var(--spacing-lg)' }}
            />
          </>
        ) : (
          <>
            <p style={{ marginBottom: 'var(--spacing-md)', lineHeight: 'var(--line-height-relaxed)' }}>
              {editedCaption || post.caption}
            </p>

            {(editedHashtags || post.hashtags.length > 0) && (
              <div style={{ marginBottom: 'var(--spacing-md)', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                {editedHashtags
                  ? editedHashtags.split(' ').map((tag, i) => (
                      tag.trim() && (
                        <span
                          key={i}
                          style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: 'var(--gray-100)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--primary)',
                          }}
                        >
                          {tag}
                        </span>
                      )
                    ))
                  : post.hashtags.map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: 'var(--gray-100)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--font-size-sm)',
                          color: 'var(--primary)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
              </div>
            )}

            {post.trendingTopics.length > 0 && (
              <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-600)', marginBottom: 'var(--spacing-sm)' }}>
                  Trending Topics:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                  {post.trendingTopics.map((topic, i) => (
                    <span key={i} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-700)' }}>
                      • {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="card-footer">
        {post.status === 'draft' ? (
          <>
            <button
              className="btn-secondary btn-sm"
              onClick={() => (isEditing ? handleSaveEdit() : setIsEditing(true))}
              disabled={isLoading}
            >
              {isEditing ? 'Save Changes' : 'Edit'}
            </button>
            {isEditing && (
              <button
                className="btn-secondary btn-sm"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
            <button
              className="btn-error btn-sm"
              onClick={handleDelete}
              disabled={isLoading}
            >
              Delete
            </button>
            <div style={{ flex: 1 }}></div>
            <button
              className="btn-success"
              onClick={handleApproveAndPost}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Posting...
                </>
              ) : (
                '✓ Approve & Post'
              )}
            </button>
          </>
        ) : (
          <>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-600)' }}>
              Posted on {new Date(post.postedAt).toLocaleDateString()}
            </span>
            {post.engagement && (
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)', color: 'var(--gray-600)' }}>
                <span>👍 {post.engagement.likes}</span>
                <span>💬 {post.engagement.comments}</span>
                <span>↗️ {post.engagement.shares}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
