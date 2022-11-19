import { StateWithEvent } from '../app/components/XstateChecker';

figma.showUI(__html__);

type Message = {
  type: 'create-states';
  states: StateWithEvent[];
};

figma.ui.onmessage = async (msg: Message) => {
  await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  if (msg.type === 'create-states') {
    const nodes = [];
    const frames = msg.states.sort((a, b) => {
      if (a.isInitial) {
        return -1;
      }
      return a.events.length > b.events.length ? -1 : 1;
    }).map((state) => {
      const frame = figma.createFrame();
      figma.currentPage.appendChild(frame);
      nodes.push(frame);
      return {state, frame};
    });

    frames.forEach(({state, frame}, i) => { 
      frame.x = 1064 * i;
      frame.name = state.name;
      frame.resize(1024, 768);

      const title = figma.createText();
      title.fontSize = 20;
      title.fills = [{ type: 'SOLID', color: { b: 0, g: 0, r: 0 } }];
      title.characters = state.name;

      title.x = 20;
      title.y = 20;
      frame.appendChild(title);

      state.events.forEach((event, index) => {
        const button = figma.createRectangle();
        frame.appendChild(button);

        button.resize(40 + event.type.length * 10, 60);
        button.fills = [{ type: 'SOLID', color: { b: 1, g: 0.3, r: 0.3 } }];
        button.x = 20;
        button.y = 80 * index + 100;

        const destinationId = frames.find(({state: s}) => s.name === event.target)?.frame.id;
        button.reactions = [
          {
            action: {
              type: 'NODE',
              destinationId,
              navigation: 'NAVIGATE',
              transition: null,
              preserveScrollPosition: false,
              resetVideoPosition: false,
            },
            trigger: {
              type: 'ON_CLICK',
            },
          },
        ];

        const title = figma.createText();
        frame.appendChild(title);

        title.characters = event.type;
        title.fontSize = 16;
        title.fills = [{ type: 'SOLID', color: { b: 1, g: 1, r: 1 } }];
        title.resize(40 + event.type.length * 10, 60);
        title.textAlignVertical = 'CENTER';
        title.textAlignHorizontal = 'CENTER';
        title.x = 20;
        title.y = 80 * index + 100;
      });
    });

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);

    // This is how figma responds back to the ui
    figma.ui.postMessage({
      type: 'create-states',
      message: `Created States`,
    });
  }

  figma.closePlugin();
};
