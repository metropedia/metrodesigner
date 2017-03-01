const initialState = {
  metroLines: [],
  currentMetroLine: null,
  currentEditJoint: {
    data: {
      x1: 0, y1: 0,
      x2: 0, y2: 0,
      type: '',
      flipped: false
    }
  },
  pointerRadius: 10,
  resolution: 20,
  scalePercentage: 0.76,
  inputMode: 'draw',
  pathType: 'straight',
  width: 0,
  height: 0,
  container: null,
};

const designer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case 'FOO':
      console.log(action.text)
      newState = {
        text: action.text,
      }; break;
    case 'INIT':
      newState = {
        ...state,
        ...action.def,
      }; break;
    case 'NEW_METRO_LINE':
      newState = {
        ...state,
        metroLines: action.metroLines,
        currentMetroLine: action.currentMetroLine
      }; break;
    case 'CHANGE_CANVAS_WIDTH':
      newState = {
        ...state,
        width: action.width
      }; break;
    case 'CHANGE_CANVAS_HEIGHT':
      newState = {
        ...state,
        height: action.height
      }; break;
    case 'SET_INPUT_MODE':
      newState = {
        ...state,
        inputMode: action.inputMode
      }; break;
    case 'ZOOMING':
      newState = {
        ...state,
        scalePercentage: parseFloat(state.scalePercentage * action.scaleBy)
      }; break;
    case 'CENTER':
      newState = {
        ...state,
        scalePercentage: action.scalePercentage
      }; break;
    case 'USE_PATH_TYPE':
      newState = {
        ...state,
        pathType: action.pathType
      }; break;
    case 'JOINT_DRAG':
      newState = {
        ...state,
        currentEditJoint: action.currentEditJoint
      }; break;
    case 'JOINT_MOUSE_DOWN':
      newState = {
        ...state,
        currentEditJoint: action.currentEditJoint
      }; break;
    case 'CANVAS_MOUSE_CLICK':
      newState = {
        ...state,
        metroLines: action.metroLines
      }; break;
    case 'FLIP_LAST':
      newState = {
        ...state,
        metroLines: action.metroLines
      }; break;
    case 'APPLY_PATH_CHANGE':
      newState = {
        ...state,
        currentEditJoint: action.currentEditJoint
      }; break;
    case 'SPLIT_PATH':
      newState = {
        ...state,
        metroLines: action.metroLines,
        currentEditJoint: initialState.currentEditJoint
      }; break;
    default:
      newState = state;
  }
  console.log(action.type, newState);
  return newState;
}

export default designer
