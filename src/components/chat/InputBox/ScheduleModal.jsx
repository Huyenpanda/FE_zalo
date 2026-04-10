import React, { useState } from 'react';
import styles from './ScheduleModal.module.css';

const ScheduleModal = ({ onSchedule, onClose }) => {
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [scheduleTitle, setScheduleTitle] = useState('');
  const [scheduleDescription, setScheduleDescription] = useState('');
  const [scheduleType, setScheduleType] = useState('reminder');

  const handleSchedule = () => {
    if (!scheduledDate || !scheduledTime || !scheduleTitle) {
      alert('Vui lòng điền đủ thông tin');
      return;
    }

    const scheduleData = {
      type: scheduleType,
      title: scheduleTitle,
      description: scheduleDescription,
      date: scheduledDate,
      time: scheduledTime,
      dateTime: `${scheduledDate}T${scheduledTime}`,
      createdAt: new Date().toISOString()
    };

    onSchedule(scheduleData);
    setScheduledDate('');
    setScheduledTime('');
    setScheduleTitle('');
    setScheduleDescription('');
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={styles.scheduleOverlay} onClick={onClose}>
      <div className={styles.scheduleModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.scheduleHeader}>
          <h3>Đặt Lịch Hẹn</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className={styles.scheduleContent}>
          <div className={styles.formGroup}>
            <label>Loại Lịch Hẹn</label>
            <select 
              value={scheduleType}
              onChange={(e) => setScheduleType(e.target.value)}
              className={styles.select}
            >
              <option value="reminder">Nhắc nhở</option>
              <option value="meeting">Cuộc họp</option>
              <option value="event">Sự kiện</option>
              <option value="birthday">Sinh nhật</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Tiêu Đề</label>
            <input
              type="text"
              placeholder="Nhập tiêu đề lịch hẹn..."
              value={scheduleTitle}
              onChange={(e) => setScheduleTitle(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Mô Tả</label>
            <textarea
              placeholder="Nhập mô tả (tùy chọn)..."
              value={scheduleDescription}
              onChange={(e) => setScheduleDescription(e.target.value)}
              className={styles.textarea}
              rows="3"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Ngày</label>
              <input
                type="date"
                min={today}
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Giờ</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          {scheduledDate && (
            <div className={styles.preview}>
              <p>
                <i className="fas fa-calendar-alt"></i>
                {new Date(scheduledDate).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p>
                <i className="fas fa-clock"></i>
                {scheduledTime || 'Chưa chọn giờ'}
              </p>
            </div>
          )}

          <div className={styles.actions}>
            <button className={styles.cancelBtn} onClick={onClose}>
              Hủy
            </button>
            <button className={styles.scheduleBtn} onClick={handleSchedule}>
              <i className="fas fa-calendar-check"></i>
              Đặt Lịch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
