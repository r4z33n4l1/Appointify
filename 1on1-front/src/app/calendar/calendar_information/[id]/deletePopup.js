import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css'; // Import the CSS
import styles from './styles.module.css';

const CalendarDeleteConfirmation = ({ id, calendarName, onDeleteConfirm }) => {
    return (
        <Popup
            trigger={<button className={styles.deleteButton}>Delete</button>}
            modal
            nested
            position="right center"
        >
            {close => (
     <div className={styles.modal}>
     <button className={styles.close} onClick={close}>
         &times;
     </button>
     <div className={styles.header}> Delete {calendarName} </div>
     <div className={styles.content}>
         {' '}
         Are you sure you want to delete {calendarName}? This action cannot be undone.
     </div>
     <div className={styles.actions}>
         <button
             className={styles.button}
             onClick={() => {
                 console.log('modal closed ');
                 close();
             }}
         >
             Cancel
         </button>
         <button
             className={styles.button}
             onClick={() => {
                 onDeleteConfirm(id); // Pass the id to the onDeleteConfirm function
                 close();
             }}
         >
             Delete
         </button>
     </div>
 </div>
            )}
        </Popup>
    );
};

export default CalendarDeleteConfirmation;
