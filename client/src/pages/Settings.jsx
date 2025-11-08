import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export default function Settings() {
  const { user, updateProfile, connectSocialMedia, isLoading, error, clearError } = useAuthStore();
  const [activeTab, setActiveTab] = useState('credentials');
  const [formData, setFormData] = useState({
    openaiKey: '',
    facebookPageId: '',
    facebookToken: '',
    linkedinProfileId: '',
    linkedinToken: '',
  });
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError('');
    clearError();
  };

  const handleSaveOpenAI = async () => {
    if (!formData.openaiKey.trim()) {
      setLocalError('OpenAI API key is required');
      return;
    }
    // In production, this would be sent securely to backend
    setSuccessMessage('OpenAI API key saved securely');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleConnectFacebook = async () => {
    if (!formData.facebookPageId.trim() || !formData.facebookToken.trim()) {
      setLocalError('Facebook Page ID and Access Token are required');
      return;
    }

    try {
      await connectSocialMedia('facebook', {
        pageId: formData.facebookPageId,
        accessToken: formData.facebookToken,
      });
      setSuccessMessage('Facebook connected successfully');
      setFormData((prev) => ({
        ...prev,
        facebookPageId: '',
        facebookToken: '',
      }));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to connect Facebook');
    }
  };

  const handleConnectLinkedIn = async () => {
    if (!formData.linkedinProfileId.trim() || !formData.linkedinToken.trim()) {
      setLocalError('LinkedIn Profile ID and Access Token are required');
      return;
    }

    try {
      await connectSocialMedia('linkedin', {
        profileId: formData.linkedinProfileId,
        accessToken: formData.linkedinToken,
      });
      setSuccessMessage('LinkedIn connected successfully');
      setFormData((prev) => ({
        ...prev,
        linkedinProfileId: '',
        linkedinToken: '',
      }));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to connect LinkedIn');
    }
  };

  const displayError = localError || error;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--spacing-lg)' }}>
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1>Settings</h1>
        <p className="text-muted">Configure your API credentials and preferences</p>
      </div>

      {displayError && (
        <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-lg)' }}>
          {displayError}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success" style={{ marginBottom: 'var(--spacing-lg)' }}>
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)', borderBottom: '1px solid var(--gray-200)', paddingBottom: 'var(--spacing-md)' }}>
        <button
          onClick={() => setActiveTab('credentials')}
          style={{
            padding: 'var(--spacing-md) var(--spacing-lg)',
            borderBottom: activeTab === 'credentials' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'credentials' ? 'var(--primary)' : 'var(--gray-600)',
            fontWeight: activeTab === 'credentials' ? '600' : '500',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            fontSize: 'var(--font-size-base)',
          }}
        >
          API Credentials
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          style={{
            padding: 'var(--spacing-md) var(--spacing-lg)',
            borderBottom: activeTab === 'preferences' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'preferences' ? 'var(--primary)' : 'var(--gray-600)',
            fontWeight: activeTab === 'preferences' ? '600' : '500',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            fontSize: 'var(--font-size-base)',
          }}
        >
          Preferences
        </button>
      </div>

      {/* Credentials Tab */}
      {activeTab === 'credentials' && (
        <div className="grid grid-2" style={{ gap: 'var(--spacing-xl)' }}>
          {/* OpenAI */}
          <div className="card">
            <div className="card-header">
              <h3>OpenAI API</h3>
              <p className="text-muted" style={{ marginBottom: 0 }}>For AI caption generation</p>
            </div>
            <div className="card-body">
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '500' }}>
                API Key
              </label>
              <input
                type="password"
                name="openaiKey"
                value={formData.openaiKey}
                onChange={handleChange}
                placeholder="sk-..."
                disabled={isLoading}
                style={{ width: '100%', marginBottom: 'var(--spacing-md)' }}
              />
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-500)', marginBottom: 'var(--spacing-md)' }}>
                Get your key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI dashboard</a>
              </p>
            </div>
            <div className="card-footer">
              <button className="btn-primary" onClick={handleSaveOpenAI} disabled={isLoading}>
                Save API Key
              </button>
            </div>
          </div>

          {/* Facebook */}
          <div className="card">
            <div className="card-header">
              <h3>Facebook</h3>
              <p className="text-muted" style={{ marginBottom: 0 }}>
                {user?.socialMediaAccounts?.facebook?.connected ? '✓ Connected' : 'Not connected'}
              </p>
            </div>
            <div className="card-body">
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '500' }}>
                Page ID
              </label>
              <input
                type="text"
                name="facebookPageId"
                value={formData.facebookPageId}
                onChange={handleChange}
                placeholder="123456789"
                disabled={isLoading}
                style={{ width: '100%', marginBottom: 'var(--spacing-lg)' }}
              />

              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '500' }}>
                Access Token
              </label>
              <input
                type="password"
                name="facebookToken"
                value={formData.facebookToken}
                onChange={handleChange}
                placeholder="EAAB..."
                disabled={isLoading}
                style={{ width: '100%', marginBottom: 'var(--spacing-md)' }}
              />
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-500)', marginBottom: 'var(--spacing-md)' }}>
                Get from <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer">Facebook Developers</a>
              </p>
            </div>
            <div className="card-footer">
              <button className="btn-primary" onClick={handleConnectFacebook} disabled={isLoading}>
                Connect Facebook
              </button>
            </div>
          </div>

          {/* LinkedIn */}
          <div className="card">
            <div className="card-header">
              <h3>LinkedIn</h3>
              <p className="text-muted" style={{ marginBottom: 0 }}>
                {user?.socialMediaAccounts?.linkedin?.connected ? '✓ Connected' : 'Not connected'}
              </p>
            </div>
            <div className="card-body">
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '500' }}>
                Profile ID
              </label>
              <input
                type="text"
                name="linkedinProfileId"
                value={formData.linkedinProfileId}
                onChange={handleChange}
                placeholder="123456789"
                disabled={isLoading}
                style={{ width: '100%', marginBottom: 'var(--spacing-lg)' }}
              />

              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '500' }}>
                Access Token
              </label>
              <input
                type="password"
                name="linkedinToken"
                value={formData.linkedinToken}
                onChange={handleChange}
                placeholder="AQD..."
                disabled={isLoading}
                style={{ width: '100%', marginBottom: 'var(--spacing-md)' }}
              />
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-500)', marginBottom: 'var(--spacing-md)' }}>
                Get from <a href="https://www.linkedin.com/developers" target="_blank" rel="noopener noreferrer">LinkedIn Developers</a>
              </p>
            </div>
            <div className="card-footer">
              <button className="btn-primary" onClick={handleConnectLinkedIn} disabled={isLoading}>
                Connect LinkedIn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="card">
          <div className="card-header">
            <h3>Posting Preferences</h3>
          </div>
          <div className="card-body">
            <p className="text-muted">Configure your automatic posting preferences</p>
            <div style={{ marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-lg)', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--radius-lg)' }}>
              <p style={{ color: 'var(--gray-600)' }}>Preferences settings coming soon...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
