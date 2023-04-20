import { createContext, useContext, useState, useRef } from 'react';
import { v4 as uuid4 } from 'uuid';
const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const notificationsRef = useRef([])

  const addSuccessNotification = (content) => addNotification('success', content);
  const addErrorNotification = (content) => addNotification('error', content);
  const addWarningNotification = (content) => addNotification('warning', content);
  const addInfoNotification = (content) => addNotification('info', content);

  const addNotification = (notificationType ,content) => {
    const notification = {
      content,
      type: notificationType,
      statusIconAriaLabel : notificationType,
      dismissLabel: 'Cancella messaggio',
      dismissible: true,
      id: uuid4(),
      onDismiss: () => {
        const newNotifications = notificationsRef.current.filter((n) => n.id !== notification.id);
        setNotifications(newNotifications);
        notificationsRef.current = newNotifications;
      },
    };
    setNotifications([...notifications, notification]);
    notificationsRef.current.push(notification);
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addSuccessNotification, 
      addErrorNotification, 
      addWarningNotification,
      addInfoNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

const useNotifications = () => {
  const helpers = useContext(NotificationContext);
  return helpers;
};

export { NotificationProvider, NotificationContext, useNotifications };