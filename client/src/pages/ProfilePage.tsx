// import { PencilSimple, LockKey, Envelope, Phone, MapPin, Link as LinkIcon, FacebookLogo, TwitterLogo, LinkedinLogo, InstagramLogo } from '@phosphor-icons/react';
import { Button, Col, Row, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import userProPic from '../assets/User.png';
import Loader from '../components/Loader';
import { profileKeys } from '../constant/profile';
import { useGetSelfProfileQuery } from '../redux/features/authApi';

// Define a style tag to inject new, unique styles
const newStyles = `
  .profile-page-container {
    background-color: #f0f2f5;
    padding: 2rem;
    min-height: calc(100vh - 6rem);
  }

  .profile-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    height: 100%;
  }

  .profile-summary-card {
    text-align: center;
  }
  
  .profile-avatar-wrapper {
    border: 4px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    margin: 0 auto 1rem auto;
    width: 150px;
    height: 150px;
  }

  .user-name {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  .user-title {
    font-size: 1rem;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 1.5rem;
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .social-links-title {
    font-weight: 600;
    color: #4b5563;
    margin-bottom: 1rem;
    text-align: left;
    border-top: 1px solid #e5e7eb;
    padding-top: 1.5rem;
  }

  .social-icon-wrapper {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .social-icon {
    font-size: 1.5rem;
    color: #6b7280;
    transition: color 0.3s, transform 0.3s;
  }
  .social-icon:hover {
    color: #3b82f6;
    transform: translateY(-2px);
  }

  .details-card-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #3b82f6;
    padding-bottom: 0.75rem;
    display: inline-block;
  }

  .info-item {
    display: flex;
    align-items: flex-start;
    padding: 1.25rem 0.5rem;
    border-bottom: 1px solid #f3f4f6;
    gap: 1rem;
  }

  .info-item:last-child {
    border-bottom: none;
  }

  .info-key {
    font-weight: 600;
    color: #4b5563;
    flex-basis: 30%;
    text-transform: capitalize;
  }

  .info-value {
    font-weight: 500;
    color: #1f2937;
    flex-basis: 70%;
    word-break: break-word;
  }

  .info-value.not-provided {
    color: #9ca3af;
    font-style: italic;
  }
`;

const ProfilePage = () => {
  const { data, isLoading } = useGetSelfProfileQuery(undefined);
  const profileData = data?.data;

  if (isLoading) return <Loader />;

  // Define which keys are for social links to render them differently
  const socialKeys = ['facebook', 'twitter', 'linkedin', 'instagram'];
  const generalInfoKeys = profileKeys.filter(
    (key) => !socialKeys.includes(key.keyName.toLowerCase()) && !['name', 'title', 'avatar'].includes(key.keyName.toLowerCase())
  );
  
  const socialLinks = profileKeys
    .filter(key => socialKeys.includes(key.keyName.toLowerCase()) && profileData[key.keyName])
    .map(key => ({ ...key, value: profileData[key.keyName] }));

  return (
    <>
      <style>{newStyles}</style>
      <div className='profile-page-container'>
        <Row gutter={[32, 32]}>
          {/* Left Column: Profile Summary */}
          <Col xs={24} md={8}>
            <div className='profile-card profile-summary-card'>
              <Avatar
                size={150}
                src={profileData?.avatar || userProPic}
                className='profile-avatar-wrapper'
              />
              {/* UPDATED: Changed fallback text */}
              <h1 className='user-name'>{profileData?.name || '—'}</h1>
              <p className='user-title'>{profileData?.title || '—'}</p>
              
              <div className='action-buttons'>
                 <Link to='/edit-profile'>
                    <Button type='primary' icon={<PencilSimple />} block size='large'>
                      Edit Profile
                    </Button>
                  </Link>
                  <Link to='/change-password'>
                    <Button icon={<LockKey />} block size='large'>
                      Change Password
                    </Button>
                  </Link>
              </div>

              {socialLinks.length > 0 && (
                <>
                  <h3 className='social-links-title'>Social Profiles</h3>
                  <div className='social-icon-wrapper'>
                    {socialLinks.map(social => (
                      <a href={social.value} key={social.keyName} target='_blank' rel='noopener noreferrer' className='social-icon'>
                        {social.keyName.toLowerCase() === 'facebook' && <FacebookLogo />}
                        {social.keyName.toLowerCase() === 'twitter' && <TwitterLogo />}
                        {social.keyName.toLowerCase() === 'linkedin' && <LinkedinLogo />}
                        {social.keyName.toLowerCase() === 'instagram' && <InstagramLogo />}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Col>

          {/* Right Column: Detailed Information */}
          <Col xs={24} md={16}>
            <div className='profile-card profile-details-card'>
              <h2 className='details-card-title'>Personal Information</h2>
              {generalInfoKeys.map((key) => (
                <ProfileInfoItems
                  key={key.keyName}
                  keyName={key.keyName}
                  value={profileData[key.keyName]}
                />
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ProfilePage;

const ProfileInfoItems = ({ keyName, value }: { keyName: string; value: string | undefined }) => {
  return (
    <div className='info-item'>
      <span className='info-key'>{keyName}</span>
      {/* UPDATED: Changed fallback text */}
      <span className={`info-value ${!value ? 'not-provided' : ''}`}>
        {value || '—'}
      </span>
    </div>
  );
};