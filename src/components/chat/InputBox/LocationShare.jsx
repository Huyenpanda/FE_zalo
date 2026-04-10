import React, { useState, useEffect } from 'react';
import styles from './LocationShare.module.css';

const LocationShare = ({ onLocationShare, onClose }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationName, setLocationName] = useState('');

  const getCurrentLocation = () => {
    setLoading(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError('Trình duyệt không hỗ trợ Geolocation');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setLoading(false);
      },
      (error) => {
        setError('Không thể lấy vị trí. Vui lòng kiểm tra quyền truy cập.');
        setLoading(false);
      }
    );
  };

  const handleShare = () => {
    if (!location) {
      setError('Vui lòng chọn vị trí');
      return;
    }

    const locationData = {
      type: 'location',
      latitude: location.latitude,
      longitude: location.longitude,
      name: locationName || 'Vị trí được chia sẻ',
      mapUrl: `https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
      sharedAt: new Date().toISOString()
    };

    onLocationShare(locationData);
    onClose();
  };

  return (
    <div className={styles.locationOverlay} onClick={onClose}>
      <div className={styles.locationModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.locationHeader}>
          <h3>Chia Sẻ Vị Trí</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className={styles.locationContent}>
          {!location ? (
            <div className={styles.locationInfo}>
              <i className="fas fa-map-marker-alt"></i>
              <p>Nhấn nút dưới để chia sẻ vị trí hiện tại của bạn</p>
              <p className={styles.note}>Chúng tôi chỉ sử dụng vị trí khi bạn yêu cầu</p>
            </div>
          ) : (
            <div className={styles.locationSelected}>
              <div className={styles.mapPreview}>
                <img 
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=15&size=300x200&markers=${location.latitude},${location.longitude}&key=AIzaSyBu-916DdpKAjTmJKoperT5Apc7Tia34l0`}
                  alt="Map"
                  className={styles.mapImage}
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23f0f0f0' width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3EBản đồ%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%23999'%3E${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}%3C/text%3E%3C/svg%3E`;
                  }}
                />
              </div>
              <div className={styles.locationDetails}>
                <p>
                  <i className="fas fa-map-marker-alt"></i>
                  {locationName}
                </p>
                <p className={styles.accuracy}>
                  <i className="fas fa-info-circle"></i>
                  Độ chính xác: {Math.round(location.accuracy || 0)}m
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className={styles.errorMessage}>
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div className={styles.actions}>
            <button className={styles.cancelBtn} onClick={onClose}>
              Hủy
            </button>
            {!location ? (
              <button 
                className={styles.shareBtn}
                onClick={getCurrentLocation}
                disabled={loading}
              >
                <i className={loading ? 'fas fa-spinner fa-spin' : 'fas fa-map-marker-alt'}></i>
                {loading ? 'Đang lấy vị trí...' : 'Lấy Vị Trí Hiện Tại'}
              </button>
            ) : (
              <button className={styles.shareBtn} onClick={handleShare}>
                <i className="fas fa-share"></i>
                Chia Sẻ Vị Trí
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationShare;
