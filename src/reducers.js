const initialState = {
  metroLines: [],
  currentMetroLine: null,
  currentEditJoint: {
    data: {
      x1: 0, y1: 0,
      x2: 0, y2: 0,
      flipped: false
    }
  },
  pointerRadius: 10,
  resolution: 20,
  scalePercentage: 0.76,
  inputMode: null,
  pathType: null,
  width: 0,
  height: 0,
  container: null,
};

const designer = (state = initialState, action) => {
  switch (action.type) {
    case 'FOO':
      console.log(action.text)
      return {
        text: action.text,
      };
    case 'INIT':
      return {
        ...state,
        ...action.states
      };
    case 'NEW_METRO_LINE':
      return {
        ...state,
        ...action.states
      };
    case 'CHANGE_CANVAS_WIDTH':
      return {
        ...state,
        width: action.width
      };
    case 'CHANGE_CANVAS_HEIGHT':
      return {
        ...state,
        height: action.height
      };
    case 'SET_INPUT_MODE':
      return {
        ...state,
        inputMode: action.inputMode
      };
    case 'ZOOMING':
      return {
        ...state,
        scalePercentage: action.scalePercentage
      };
    default:
      return state;
  }
}

export default designer
