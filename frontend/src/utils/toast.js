import { toast } from 'react-toastify';

// Success toast
export const showSuccess = (message) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Error toast
export const showError = (message) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Info toast
export const showInfo = (message) => {
  toast.info(message, {
    position: 'top-right',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Warning toast
export const showWarning = (message) => {
  toast.warning(message, {
    position: 'top-right',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Your Turn notification (special)
export const showYourTurn = (queueName) => {
  toast.success(
    <div>
      <strong>🔔 IT'S YOUR TURN!</strong>
      <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
        Please proceed to {queueName} immediately
      </p>
    </div>,
    {
      position: 'top-center',
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      style: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        fontSize: '16px',
        padding: '20px',
      },
    }
  );
};

// Turn approaching notification
export const showTurnApproaching = (position, peopleAhead) => {
  toast.info(
    <div>
      <strong>⏰ Your turn is approaching!</strong>
      <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
        You are #{position} • {peopleAhead} {peopleAhead === 1 ? 'person' : 'people'} ahead
      </p>
    </div>,
    {
      position: 'top-right',
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    }
  );
};

// Promise toast (for async operations)
export const showPromise = (promise, messages) => {
  return toast.promise(promise, {
    pending: messages.pending || 'Processing...',
    success: messages.success || 'Success!',
    error: messages.error || 'Something went wrong',
  });
};

const toastUtils = {
  showSuccess,
  showError,
  showInfo,
  showWarning,
  showYourTurn,
  showTurnApproaching,
  showPromise,
};

export default toastUtils;
