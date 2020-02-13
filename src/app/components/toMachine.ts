import * as XState from 'xstate';
import { assign, interpret, Machine, send, spawn, StateNode } from 'xstate';
import { raise } from 'xstate/lib/actions';

export function toMachine(machine: StateNode<any> | string): StateNode<any> {
  if (typeof machine !== 'string') {
    return machine;
  }

  let createMachine: Function;
  try {
    createMachine = new Function(
      'Machine',
      'interpret',
      'assign',
      'send',
      'sendParent',
      'spawn',
      'raise',
      'actions',
      'XState',
      machine,
    );
  } catch (e) {
    throw e;
  }

  const machines: Array<StateNode<any>> = [];

  const machineProxy = (config: any, options: any) => {
    const machine = Machine(config, options);
    machines.push(machine);
    return machine;
  };

  try {
    createMachine(
      machineProxy,
      interpret,
      assign,
      send,
      XState.sendParent,
      spawn,
      raise,
      XState.actions,
      XState,
    );
  } catch (e) {
    throw e;
  }

  return machines[machines.length - 1]! as StateNode<any>;
}