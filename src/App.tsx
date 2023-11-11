import { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [channel, setChannel] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function sendMessage() {
    try {
      setIsSending(true);

      const response = await axios.post(
        `https://ntfy.sh/${channel}`,
        `${message}`
      );
      console.log(response);
      setSuccessMessage('✔️ Notification Sent !');

      setTimeout(() => {
        setSuccessMessage('');
        setMessage('');
        setIsSending(false);
        focusOnTextArea();
      }, 2000);
    } catch (error) {
      console.log(error);
      setErrorMessage('❌ Notification Failed ! Check your settings');
      setIsSending(false);
    }
  }

  function handleChannelChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSuccessMessage('');
    setErrorMessage('');
    setChannel(e.target.value);
  }

  function handleMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setSuccessMessage('');
    setErrorMessage('');
    setMessage(e.target.value);
  }

  function handleKeyUp(event: React.KeyboardEvent) {
    if (event.key === 'Enter' && channel !== '' && message !== '')
      sendMessage();
  }

  function focusOnTextArea() {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }

  return (
    <body>
      <h1>Ntfy</h1>
      <div className="card flex">
        <input
          type="text"
          className="input-text"
          placeholder="Topic..."
          value={channel}
          onChange={(e) => handleChannelChange(e)}
        />
        <textarea
          ref={textareaRef}
          rows={4}
          cols={50}
          className="textarea-text"
          placeholder="Message..."
          value={message}
          onChange={(e) => handleMessageChange(e)}
        ></textarea>
        <button
          onClick={() => sendMessage()}
          onKeyUp={(event: React.KeyboardEvent) =>
            !isSending && handleKeyUp(event)
          }
          disabled={!channel || !message || isSending}
        >
          Notify !
        </button>
        <div className="toast">
          {errorMessage && <p>{errorMessage}</p>}
          {successMessage && isSending && <p>{successMessage}</p>}
        </div>
      </div>
    </body>
  );
}

export default App;
