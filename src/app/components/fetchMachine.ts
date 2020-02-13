export const fetchMachine = `
// Available variables:
// - Machine
// - interpret
// - assign
// - send
// - sendParent
// - spawn
// - raise
// - actions
// - XState (all XState exports)

const fetchMachine = Machine({
  id: 'fetch',
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH: 'loading'
      }
    },
    loading: {
      on: {
        RESOLVE: 'success',
        REJECT: 'failure'
      }
    },
    success: {
      type: 'final'
    },
    errored: {
      type: 'final'
    },
    failure: {
      on: {
        RETRY: {
          target: 'loading',
        },
        RETRY_TOO_OFTEN: 'errored'
      }
    }
  }
});
`;
