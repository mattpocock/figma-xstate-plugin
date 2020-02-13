import React, { useEffect, useState } from 'react';
import '../styles/ui.css';
import { XStateChecker, StateWithEvent } from './XstateChecker';

const App: React.FC = () => {
  const onCreate = () => {
    parent.postMessage(
      { pluginMessage: { type: 'create-rectangles', count: 5 } },
      '*',
    );
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };

  useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'create-rectangles') {
        console.log(`Figma Says: ${message}`);
      }
    };
  }, []);

  const [states, setStates] = useState<StateWithEvent[]>([]);

  console.log({ states });

  return (
    <div>
      <h2>Import XState to Figma</h2>
      <XStateChecker
        onChange={(value) => {
          setStates(value.states);
        }}
      />
      <button id="create" onClick={onCreate}>
        Create
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default App;
