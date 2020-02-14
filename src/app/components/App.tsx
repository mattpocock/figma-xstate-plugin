import React, { useEffect, useState } from 'react';
import '../styles/ui.css';
import { XStateChecker, StateWithEvent } from './XstateChecker';

const App: React.FC = () => {
  const [states, setStates] = useState<StateWithEvent[]>([]);
  const onCreate = () => {
    parent.postMessage(
      { pluginMessage: { type: 'create-states', states } },
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
      if (type === 'create-states') {
        console.log(`Figma Says: ${message}`);
      }
    };
  }, []);

  return (
    <div>
      <h2>Import XState to Figma</h2>
      <XStateChecker
        onChange={(value) => {
          setStates(value.states);
        }}
      />
      <div style={{ marginTop: 16 }}>
        <button id="create" onClick={onCreate}>
          Create
        </button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default App;
