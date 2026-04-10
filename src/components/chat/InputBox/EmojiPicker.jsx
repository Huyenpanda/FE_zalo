import React, { useState } from 'react';
import styles from './EmojiPicker.module.css';

const EMOJI_CATEGORIES = {
  smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙'],
  gestures: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👍', '👎', '👊', '👏', '🙌', '👐'],
  hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '💌', '💋'],
  nature: ['😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '❤️', '🌹', '🌺', '🌻', '🌷', '🌼', '🌸', '💐', '🌊', '🌴', '🎄'],
  foods: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🍕'],
  sports: ['🏀', '🏈', '🏐', '🎾', '🏐', '🏑', '🏒', '🥍', '🏓', '🏸', '🥊', '🥋', '⛳', '⛸️', '🎣', '🎽', '🎿', '🛷', '🛹', '⛷️'],
};

const EmojiPicker = ({ onEmojiSelect, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('smileys');
  
  const categoryIcons = {
    smileys: '😊',
    gestures: '👋',
    hearts: '❤️',
    nature: '🌺',
    foods: '🍕',
    sports: '⚽',
  };

  return (
    <div className={styles.emojiPickerOverlay} onClick={onClose}>
      <div className={styles.emojiPicker} onClick={(e) => e.stopPropagation()}>
        <div className={styles.emojiHeader}>
          <h3>Chọn Biểu tượng</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className={styles.emojiCategories}>
          {Object.keys(EMOJI_CATEGORIES).map((category) => (
            <button
              key={category}
              className={`${styles.categoryBtn} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
              title={category}
            >
              {categoryIcons[category]}
            </button>
          ))}
        </div>

        <div className={styles.emojiGrid}>
          {EMOJI_CATEGORIES[selectedCategory].map((emoji, index) => (
            <button
              key={index}
              className={styles.emojiItem}
              onClick={() => onEmojiSelect(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker;
