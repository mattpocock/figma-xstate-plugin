import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import React, { useEffect, useState } from 'react';
import { fetchMachine } from './fetchMachine';
import { toMachine } from './toMachine';

export interface StateWithEvent {
  name: string;
  isInitial: boolean;
  events: {
    type: string;
    target: string;
  }[];
}

export const XStateChecker: React.FC<{
  onChange: (params: { states: StateWithEvent[]; isValid: boolean }) => void;
}> = ({ onChange }) => {
  const [code, setCode] = useState(fetchMachine);

  const checkIfTheStateMachineIsValid = (c: string) => {
    try {
      const machine = toMachine(c);

      const result: StateWithEvent[] = Object.keys(machine.states).map(
        (key) => {
          const state = machine.states[key];
          return {
            name: key,
            isInitial: machine.initial === key,
            events: state.events.map((event) => {
              const nextState = machine.transition(key, event);
              return {
                type: event,
                target: nextState.value as string,
              };
            }),
          };
        },
      );
      onChange({ states: result, isValid: true });
    } catch (e) {
      onChange({ states: [], isValid: false });
    }
  };

  useEffect(() => {
    checkIfTheStateMachineIsValid(code);
  }, [code]);

  return (
    <AceEditor
      mode={'javascript'}
      theme="monokai"
      editorProps={{ $blockScrolling: true }}
      value={code}
      onChange={(value) => setCode(value)}
      setOptions={{ tabSize: 2, fontSize: '12px' }}
      width="100%"
      height={'90px'}
      showGutter={false}
      wrapEnabled
    />
  );
};
