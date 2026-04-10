// import React, { useState } from 'react';
// import styles from './ScreenshotTool.module.css';
// const captureScreenshot = async () => {
//   setStatus('capturing');
//   try {
//     const stream = await navigator.mediaDevices.getDisplayMedia({
//       video: { cursor: 'always' }, audio: false
//     });
//     const track = stream.getVideoTracks()[0];
//     const capture = new ImageCapture(track);
//     const bitmap = await capture.grabFrame();
//     track.stop();

//     const canvas = document.createElement('canvas');
//     canvas.width = bitmap.width;
//     canvas.height = bitmap.height;
//     canvas.getContext('2d').drawImage(bitmap, 0, 0);

//     canvas.toBlob((blob) => {
//       const url = URL.createObjectURL(blob);
//       const filename = `Screenshot_${Date.now()}.png`;
//       onScreenshotTaken({ type: 'screenshot', url, name: filename, size: blob.size, contentType: 'image' });
//       setStatus('success');
//       setTimeout(onClose, 1500);
//     }, 'image/png');
//   } catch (error) {
//     console.error('Screenshot error:', error);
//     setStatus('error');
//     setTimeout(() => setStatus('ready'), 2500);
//   }
// };
// const ScreenshotTool = ({ onScreenshotTaken, onClose }) => {
//   const [status, setStatus] = useState('ready');

//   const captureScreenshot = async () => {
//     setStatus('capturing');
    
//     try {
//       const canvas = await html2canvas(document.body, {
//         allowTaint: true,
//         useCORS: true,
//         backgroundColor: '#ffffff'
//       });

//       canvas.toBlob((blob) => {
//         const url = URL.createObjectURL(blob);
//         const filename = `Screenshot_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
        
//         onScreenshotTaken({
//           type: 'screenshot',
//           url: url,
//           name: filename,
//           size: blob.size,
//           contentType: 'image'
//         });

//         setStatus('success');
//         setTimeout(onClose, 1500);
//       });
//     } catch (error) {
//       console.error('Screenshot error:', error);
//       setStatus('error');
//       setTimeout(() => setStatus('ready'), 2000);
//     }
//   };

//   return (
//     <div className={styles.screenshotOverlay} onClick={onClose}>
//       <div className={styles.screenshotModal} onClick={(e) => e.stopPropagation()}>
//         <div className={styles.screenshot Header}>
//           <h3>Chụp Màn Hình</h3>
//           <button className={styles.closeBtn} onClick={onClose}>
//             <i className="fas fa-times"></i>
//           </button>
//         </div>

//         <div className={styles.screenshotContent}>
//           {status === 'ready' && (
//             <>
//               <div className={styles.icon}>
//                 <i className="fas fa-camera"></i>
//               </div>
//               <h4>Chụp toàn bộ màn hình</h4>
//               <p>Ảnh chụp sẽ được gửi dưới dạng tệp tin hình ảnh</p>
//             </>
//           )}

//           {status === 'capturing' && (
//             <>
//               <div className={`${styles.icon} ${styles.loading}`}>
//                 <i className="fas fa-spinner fa-spin"></i>
//               </div>
//               <h4>Đang chụp...</h4>
//               <p>Vui lòng chờ</p>
//             </>
//           )}

//           {status === 'success' && (
//             <>
//               <div className={`${styles.icon} ${styles.success}`}>
//                 <i className="fas fa-check-circle"></i>
//               </div>
//               <h4>Chụp thành công!</h4>
//               <p>Ảnh chụp sẽ được gửi ngay</p>
//             </>
//           )}

//           {status === 'error' && (
//             <>
//               <div className={`${styles.icon} ${styles.error}`}>
//                 <i className="fas fa-exclamation-circle"></i>
//               </div>
//               <h4>Lỗi chụp màn hình</h4>
//               <p>Vui lòng thử lại</p>
//             </>
//           )}
//         </div>

//         {status === 'ready' && (
//           <div className={styles.actions}>
//             <button className={styles.cancelBtn} onClick={onClose}>
//               Hủy
//             </button>
//             <button className={styles.captureBtn} onClick={captureScreenshot}>
//               <i className="fas fa-camera"></i>
//               Chụp
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ScreenshotTool;
