import { useState, useEffect, useRef } from 'react';
import { User, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { generateAvatarApi, getAvatarByIdApi } from '../../api/avatarApi';
import { getSettingsApi } from '../../api/userApi';
import { useAuth } from '../../context/AuthContext';
import { getAuth } from '../../utils/tokenUtils';
import Button from '../../components/Button';
import { showToast } from '../../utils/toast';

const skinTones = [
  { id: 'very-light', color: '#F6DFC8' },
  { id: 'light', color: '#E5C39B' },
  { id: 'medium', color: '#D2A46A' },
  { id: 'tan', color: '#B88349' },
  { id: 'brown', color: '#8E5A2A' },
  { id: 'dark', color: '#4D2C12' },
];

const hairColors = [
  { id: 'black', color: '#000000' },
  { id: 'dark-brown', color: '#3A2414' },
  { id: 'brown', color: '#6B4423' },
  { id: 'light-brown', color: '#A26B3D' },
  { id: 'blonde', color: '#E6C27A' },
  { id: 'red', color: '#A53A2A' },
];

const GENDER_OPTIONS = ['male', 'female'];

const INITIAL_FORM = {
  age: '',
  gender: '',
  weight: '',
  height: '',
  skin_tone: '',
  hair_color: '',
};

const parseNumeric = val => {
  if (!val) return '';
  const num = parseInt(val);
  return isNaN(num) ? String(val) : String(num);
};

const parseAvatarToForm = avatar => ({
  age: parseNumeric(avatar.age),
  gender: avatar.gender || '',
  weight: parseNumeric(avatar.weight),
  height: parseNumeric(avatar.height),
  skin_tone: avatar.skin_tone || '',
  hair_color: avatar.hair_color || '',
});

const buildPayload = form => ({
  age: form.age ? `${form.age}y` : '',
  height: form.height ? `${form.height}cm` : '',
  weight: form.weight ? `${form.weight}kg` : '',
  gender: form.gender,
  skin_tone: form.skin_tone,
  face_shape: 'oval',
  hair_color: form.hair_color,
  eye_color: 'brown eyes',
  beard_style: 'clean shave',
  facial_expression: 'smiling',
});

const dashedBorderSvg = `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3clinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3e%3cstop offset='0%25' stop-color='%23FF8A3D' stop-opacity='0.5'/%3e%3cstop offset='50%25' stop-color='%2340B9FF' stop-opacity='0.5'/%3e%3cstop offset='100%25' stop-color='%23A6E22E' stop-opacity='0.5'/%3e%3c%2flinearGradient%3e%3c%2fdefs%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='url(%23g)' stroke-width='2' stroke-dasharray='6%2c4' stroke-linecap='round'/%3e%3c%2fsvg%3e")`;

const fieldLabelClass = 'block text-sm font-bold mb-1.5';
const inputBaseClass =
  'w-full h-12 rounded-lg border border-border-strong bg-surface-elevated px-4 text-sm font-semibold text-text-primary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-placeholder appearance-none';

export default function AvatarGeneration() {
  const { t, i18n } = useTranslation();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const toastPosition = i18n.language === 'ar' ? 'top-start' : 'top-end';
  const [form, setForm] = useState(INITIAL_FORM);
  const [processing, setProcessing] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);

  const [fetchedAvatarUrl, setFetchedAvatarUrl] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const previewRef = useRef(null);

  useEffect(() => {
    const avatarIds = user?.avatars;
    if (!avatarIds || avatarIds.length === 0) return;
    getAvatarByIdApi(avatarIds[avatarIds.length - 1])
      .then(res => {
        const avatar = res.data?.avatar;
        if (!avatar) return;
        if (avatar.image_url) setFetchedAvatarUrl(avatar.image_url);
        setForm(prev => ({ ...prev, ...parseAvatarToForm(avatar) }));
      })
      .catch(() => {});
  }, [user?.avatars]);

  const hasAvatar = !!(
    generatedImageUrl ||
    fetchedAvatarUrl ||
    user?.generatedAvatar ||
    user?.avatars?.length > 0
  );
  const displayImageUrl =
    generatedImageUrl || fetchedAvatarUrl || user?.generatedAvatar || null;
  const isSubscribed = subscriptionStatus === 'active';
  const subscriptionChecked = !subscriptionLoading;
  const showUpgrade = subscriptionChecked && hasAvatar && !isSubscribed;

  useEffect(() => {
    if (subscriptionLoading) return;
    if (hasAvatar && !isSubscribed) {
      navigate('/pricing', { replace: true });
    }
  }, [subscriptionLoading, hasAvatar, isSubscribed, navigate]);

  useEffect(() => {
    if (!user?.email) {
      setSubscriptionLoading(false);
      return;
    }
    setSubscriptionLoading(true);
    getSettingsApi({ email: user.email })
      .then(res => {
        setSubscriptionStatus(res.data.subscriptionStatus);
      })
      .catch(() => {
        setSubscriptionStatus(null);
      })
      .finally(() => setSubscriptionLoading(false));
  }, [user?.email]);

  useEffect(() => {
    if (generatedImageUrl && previewRef.current) {
      setTimeout(() => {
        previewRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 300);
    }
  }, [generatedImageUrl]);

  const handleChange = field => e => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelect = field => value => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    const required = [
      'age',
      'gender',
      'weight',
      'height',
      'skin_tone',
      'hair_color',
    ];
    const missing = required.find(f => !form[f]);
    if (missing) {
      showToast('error', t('avatar.fillAllFields'), toastPosition);
      return;
    }

    const auth = getAuth();
    if (!auth?.token) {
      navigate('/', { replace: true, state: { openAuth: 'login' } });
      return;
    }

    setProcessing(true);
    setGeneratedImageUrl(null);

    try {
      const payload = buildPayload(form);
      const res = await generateAvatarApi(payload);
      const imageUrl = res.data?.avatar?.image_url;
      if (imageUrl) {
        setGeneratedImageUrl(imageUrl);
        login({ ...user, generatedAvatar: imageUrl });
      } else {
        showToast('error', t('avatar.generationError'), toastPosition);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/', { replace: true, state: { openAuth: 'login' } });
        return;
      }
      showToast('error', t('avatar.generationError'), toastPosition);
    } finally {
      setProcessing(false);
    }
  };

  const allFilled = Object.values(form).every(v => v.trim() !== '');

  if (!getAuth()) {
    return <Navigate to="/" replace state={{ openAuth: 'login' }} />;
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <section className="text-center mt-2 sm:mt-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold flex flex-wrap justify-center gap-x-2 leading-tight">
            <span className="text-text-primary">{t('avatar.title')}</span>
            <span
              style={{
                background:
                  'linear-gradient(90deg, #40B9FF 0%, #69C9AC 50%, #AAE338 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('avatar.subtitle')}
            </span>
          </h1>
          <p className="mt-3 text-base sm:text-lg md:text-xl font-medium opacity-85 text-text-primary">
            {t('avatar.heroDesc')}
          </p>
        </section>

        <section className="mt-10 sm:mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-[480px_1fr] gap-8 max-w-6xl mx-auto items-stretch">
            <div
              className="rounded-2xl bg-surface-elevated p-6 sm:p-8"
              style={{
                border: '2px solid transparent',
                backgroundImage: `linear-gradient(var(--surface), var(--surface)), linear-gradient(90deg, #FF8A3D, var(--primary), #A6E22E)`,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
            >
              <h2 className="text-2xl sm:text-3xl mb-6 font-bold text-primary">
                {t('avatar.formTitle')}
              </h2>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={fieldLabelClass + ' text-text-primary'}>
                      {t('avatar.age')}
                    </label>
                    <input
                      type="number"
                      value={form.age}
                      onChange={handleChange('age')}
                      placeholder="e.g. 25"
                      className={inputBaseClass}
                    />
                  </div>
                  <div>
                    <label className={fieldLabelClass + ' text-text-primary'}>
                      {t('avatar.gender')}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {GENDER_OPTIONS.map(o => {
                        const isSelected = form.gender === o;
                        const borderColor = isSelected
                          ? o === 'male'
                            ? 'var(--primary)'
                            : 'var(--accent)'
                          : 'var(--Border-Strong)';
                        return (
                          <button
                            key={o}
                            type="button"
                            onClick={() => handleSelect('gender')(o)}
                            className="h-12 rounded-lg font-semibold text-sm capitalize transition-all duration-200"
                            style={{
                              border: `2px solid ${borderColor}`,
                              backgroundColor: isSelected
                                ? o === 'male'
                                  ? 'rgba(64, 185, 255, 0.08)'
                                  : 'rgba(233, 30, 99, 0.08)'
                                : 'var(--surface)',
                              color: isSelected
                                ? 'var(--text-primary)'
                                : 'var(--Disabled-Text-color)',
                            }}
                          >
                            {t('avatar.' + o)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={fieldLabelClass + ' text-text-primary'}>
                      {t('avatar.weight')}
                    </label>
                    <input
                      type="number"
                      value={form.weight}
                      onChange={handleChange('weight')}
                      placeholder="e.g. 70"
                      className={inputBaseClass}
                    />
                  </div>
                  <div>
                    <label className={fieldLabelClass + ' text-text-primary'}>
                      {t('avatar.height')}
                    </label>
                    <input
                      type="number"
                      value={form.height}
                      onChange={handleChange('height')}
                      placeholder="e.g. 175"
                      className={inputBaseClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={fieldLabelClass + ' text-text-primary'}>
                    {t('avatar.skinTone')}
                  </label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {skinTones.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSelect('skin_tone')(s.id)}
                        className="flex flex-col items-center gap-1 group"
                      >
                        <div
                          className="h-10 w-10 rounded-full border-[3px] transition-all duration-200 flex items-center justify-center mx-auto"
                          style={{
                            backgroundColor: s.color,
                            borderColor:
                              form.skin_tone === s.id
                                ? 'var(--primary)'
                                : 'var(--Border-Strong)',
                            boxShadow:
                              form.skin_tone === s.id
                                ? '0 0 0 3px var(--primary)'
                                : '0 0 0 1px rgba(0,0,0,0.08)',
                          }}
                        >
                          {form.skin_tone === s.id && (
                            <Check
                              className="h-5 w-5 text-white drop-shadow"
                              strokeWidth={3}
                            />
                          )}
                        </div>
                        <span
                          className="text-[11px] font-medium leading-tight text-center"
                          style={{
                            color:
                              form.skin_tone === s.id
                                ? 'var(--text-primary)'
                                : 'var(--Disabled-Text-color)',
                          }}
                        >
                          {t('avatar.skinTones.' + s.id)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={fieldLabelClass + ' text-text-primary'}>
                    {t('avatar.hairColor')}
                  </label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {hairColors.map(h => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => handleSelect('hair_color')(h.id)}
                        className="flex flex-col items-center gap-1 group"
                      >
                        <div
                          className="h-10 w-10 rounded-full border-[3px] transition-all duration-200 flex items-center justify-center mx-auto"
                          style={{
                            backgroundColor: h.color,
                            borderColor:
                              form.hair_color === h.id
                                ? 'var(--primary)'
                                : 'var(--Border-Strong)',
                            boxShadow:
                              form.hair_color === h.id
                                ? '0 0 0 3px var(--primary)'
                                : '0 0 0 1px rgba(0,0,0,0.08)',
                          }}
                        >
                          {form.hair_color === h.id && (
                            <Check
                              className="h-5 w-5 text-white drop-shadow"
                              strokeWidth={3}
                            />
                          )}
                        </div>
                        <span
                          className="text-[11px] font-medium leading-tight text-center"
                          style={{
                            color:
                              form.hair_color === h.id
                                ? 'var(--text-primary)'
                                : 'var(--Disabled-Text-color)',
                          }}
                        >
                          {t('avatar.hairColors.' + h.id)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  variant="styling"
                  onClick={
                    showUpgrade ? () => navigate('/pricing') : handleGenerate
                  }
                  disabled={!showUpgrade && (!allFilled || processing)}
                  className={`w-full gap-3 ${
                    !showUpgrade && (!allFilled || processing)
                      ? 'opacity-60 !cursor-not-allowed'
                      : ''
                  }`}
                >
                  {showUpgrade ? (
                    <>{t('avatar.upgrade')}</>
                  ) : processing ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      {t('avatar.generating')}
                    </>
                  ) : (
                    <>{t('avatar.generate')}</>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div
                ref={previewRef}
                className="rounded-2xl flex items-center justify-center overflow-hidden p-6 sm:p-8 min-h-[300px] sm:min-h-[400px] bg-surface-elevated flex-1"
                style={{
                  ...(!displayImageUrl && !processing
                    ? {
                        backgroundImage: dashedBorderSvg,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% 100%',
                      }
                    : {
                        border: displayImageUrl
                          ? '2px solid transparent'
                          : 'none',
                      }),
                }}
              >
                {processing ? (
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="h-12 w-12 animate-spin rounded-full border-4 border-border-strong"
                      style={{ borderTopColor: 'var(--secondary)' }}
                    />
                    <p className="text-sm text-text-disabled">
                      {t('avatar.generatingAvatar')}
                    </p>
                  </div>
                ) : displayImageUrl ? (
                  <img
                    src={displayImageUrl}
                    alt="Generated Avatar"
                    className="w-full h-full object-contain rounded-2xl"
                    style={{ maxHeight: '600px' }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 px-6 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bg-primary">
                      <User
                        className="h-10 w-10 text-icon-disabled"
                        strokeWidth={1.5}
                      />
                    </div>
                    <p className="text-sm sm:text-base text-text-disabled">
                      {t('avatar.placeholder')}
                    </p>
                  </div>
                )}
              </div>
              {displayImageUrl && (
                <Button
                  onClick={() => navigate('/tryOn')}
                  className="w-full h-12 bg-primary text-white text-base font-semibold rounded-lg shadow"
                >
                  {t('avatar.useInTryOn')}
                </Button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
