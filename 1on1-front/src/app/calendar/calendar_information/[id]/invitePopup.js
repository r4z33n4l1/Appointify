import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import ContactsSearchAndInvite from './inviteModel';
import styles from "./styles.module.css";

const InviteContactsPopup = ({ calendarId }) => {
    // Use state to control the open state of the popup
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    return (
        <div>
            <Popup 
                open={open}
                closeOnDocumentClick
                onClose={closeModal}
                modal
                nested
                trigger={<button className={styles.inviteButton}>Invite Contacts</button>}
                contentStyle={{ overflow: 'auto', maxHeight: '80vh' }} // Add this line
            >
                {close => (
                    <div>
                        <button className="close" onClick={close}>
                            &times;
                        </button>
                        <div className="header"> Invite Contacts </div>
                        <div className="content">
                            <ContactsSearchAndInvite calendarId={calendarId} />
                        </div>
                        <div className="actions">
                            <button 
                                className="button" 
                                onClick={() => {
                                    console.log('Modal closed');
                                    close();
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Popup>
        </div>
    );
};

export default InviteContactsPopup;
