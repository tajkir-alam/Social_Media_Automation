import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const NICHES = [
  { id: 'tech', label: 'Technology', description: 'AI, Software, Web Development' },
  { id: 'business', label: 'Business', description: 'Entrepreneurship, Leadership, Marketing' },
  { id: 'marketing', label: 'Marketing', description: 'Digital Marketing, SEO, Social Media' },
  { id: 'lifestyle', label: 'Lifestyle', description: 'Wellness, Fitness, Personal Development' },
  { id: 'finance', label: 'Finance', description: 'Investing, Crypto, Financial Planning' },
  { id: 'education', label: 'Education', description: 'Learning, Courses, Skill Development' },
];

const POSTING_STYLES = [
  { id: 'professional', label: 'Professional', description: 'Formal, business-focused content' },
  { id: 'casual', label: 'Casual', description: 'Friendly, conversational tone' },
  { id: 'humorous', label: 'Humorous', description: 'Funny, entertaining content' },
  { id: 'inspirational', label: 'Inspirational', description: 'Motivational, uplifting messages' },
  { id: 'educational', label: 'Educational', description: 'Informative, teaching-focused' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding, isLoading, error, clearError } = useAuthStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    niche: '',
    targetAudience: '',
    postingStyle: '',
    niches: [],
  });
  const [localError, setLocalError] = useState('');

  const handleNicheSelect = (nicheId) => {
    setFormData((prev) => ({
      ...prev,
      niche: nicheId,
    }));
    setLocalError('');
  };

  const handleStyleSelect = (styleId) => {
    setFormData((prev) => ({
      ...prev,
      postingStyle: styleId,
    }));
    setLocalError('');
  };

  const handleAudienceChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      targetAudience: e.target.value,
    }));
    setLocalError('');
  };

  const handleNext = () => {
    if (step === 1 && !formData.niche) {
      setLocalError('Please select a niche');
      return;
    }
    if (step === 2 && !formData.targetAudience.trim()) {
      setLocalError('Please describe your target audience');
      return;
    }
    if (step === 3 && !formData.postingStyle) {
      setLocalError('Please select a posting style');
      return;
    }
    setStep(step + 1);
    setLocalError('');
  };

  const handleBack = () => {
    setStep(step - 1);
    setLocalError('');
  };

  const handleSubmit = async () => {
    try {
      const selectedNiche = NICHES.find((n) => n.id === formData.niche);
      const onboardingData = {
        niche: formData.niche,
        targetAudience: formData.targetAudience,
        postingStyle: formData.postingStyle,
        niches: [
          {
            name: selectedNiche.label,
            description: selectedNiche.description,
            keywords: [],
          },
        ],
      };

      await completeOnboarding(onboardingData);
      navigate('/settings');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to complete onboarding');
    }
  };

  const displayError = localError || error;

  return (
    <div className="flex flex-center" style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)', padding: 'var(--spacing-lg)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
        {/* Header */}
        <div className="card-header">
          <div className="flex-between">
            <div>
              <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>Let's Get Started</h1>
              <p className="text-muted">Help us understand your content style</p>
            </div>
            <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600', color: 'var(--gray-500)' }}>
              Step {step} of 4
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: 'var(--spacing-lg)', height: '4px', backgroundColor: 'var(--gray-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              backgroundColor: 'var(--primary)',
              width: `${(step / 4) * 100}%`,
              transition: 'width 200ms ease-in-out',
            }}
          ></div>
        </div>

        {displayError && (
          <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <span>{displayError}</span>
          </div>
        )}

        {/* Step 1: Niche Selection */}
        {step === 1 && (
          <div className="card-body">
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>What's your main niche?</h2>
            <div className="grid grid-2">
              {NICHES.map((niche) => (
                <button
                  key={niche.id}
                  onClick={() => handleNicheSelect(niche.id)}
                  style={{
                    padding: 'var(--spacing-lg)',
                    border: formData.niche === niche.id ? '2px solid var(--primary)' : '1px solid var(--gray-300)',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: formData.niche === niche.id ? 'var(--primary)' : 'var(--white)',
                    color: formData.niche === niche.id ? 'var(--white)' : 'var(--gray-900)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: 'var(--spacing-sm)' }}>{niche.label}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.8 }}>{niche.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Target Audience */}
        {step === 2 && (
          <div className="card-body">
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Who is your target audience?</h2>
            <p className="text-muted" style={{ marginBottom: 'var(--spacing-md)' }}>
              Describe the people you want to reach (e.g., "Software developers aged 25-40", "Small business owners")
            </p>
            <textarea
              value={formData.targetAudience}
              onChange={handleAudienceChange}
              placeholder="Describe your ideal audience..."
              disabled={isLoading}
              style={{ width: '100%', minHeight: '120px' }}
            />
          </div>
        )}

        {/* Step 3: Posting Style */}
        {step === 3 && (
          <div className="card-body">
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>What's your posting style?</h2>
            <div className="grid grid-2" style={{ gap: 'var(--spacing-md)' }}>
              {POSTING_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleStyleSelect(style.id)}
                  style={{
                    padding: 'var(--spacing-lg)',
                    border: formData.postingStyle === style.id ? '2px solid var(--primary)' : '1px solid var(--gray-300)',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: formData.postingStyle === style.id ? 'var(--primary)' : 'var(--white)',
                    color: formData.postingStyle === style.id ? 'var(--white)' : 'var(--gray-900)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: 'var(--spacing-sm)' }}>{style.label}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.8 }}>{style.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="card-body">
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Review Your Profile</h2>
            <div style={{ backgroundColor: 'var(--gray-50)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--spacing-lg)' }}>
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-600)', marginBottom: 'var(--spacing-sm)' }}>Niche</p>
                <p style={{ fontWeight: '600', fontSize: 'var(--font-size-lg)' }}>
                  {NICHES.find((n) => n.id === formData.niche)?.label}
                </p>
              </div>
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-600)', marginBottom: 'var(--spacing-sm)' }}>Target Audience</p>
                <p style={{ fontWeight: '600' }}>{formData.targetAudience}</p>
              </div>
              <div>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-600)', marginBottom: 'var(--spacing-sm)' }}>Posting Style</p>
                <p style={{ fontWeight: '600' }}>
                  {POSTING_STYLES.find((s) => s.id === formData.postingStyle)?.label}
                </p>
              </div>
            </div>
            <p className="text-muted">Next, you'll connect your API credentials and start generating posts!</p>
          </div>
        )}

        {/* Footer */}
        <div className="card-footer">
          {step > 1 && (
            <button className="btn-secondary" onClick={handleBack} disabled={isLoading}>
              Back
            </button>
          )}
          <div style={{ flex: 1 }}></div>
          {step < 4 ? (
            <button className="btn-primary" onClick={handleNext} disabled={isLoading}>
              Next
            </button>
          ) : (
            <button className="btn-success" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Completing...
                </>
              ) : (
                'Complete Setup'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
