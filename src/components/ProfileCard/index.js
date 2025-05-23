// src/components/ProfileCard/index.js
import './index.css'

const ProfileCard = ({profileDetails}) => {
  const {name, profileImageUrl, shortBio} = profileDetails

  return (
    <div className="profile-card">
      <img src={profileImageUrl} alt="profile" className="profile-card-img" />
      <div className="profile-card-info">
        <h1 className="profile-card-name">{name}</h1>
        <p className="profile-card-bio">{shortBio}</p>
      </div>
    </div>
  )
}

export default ProfileCard
