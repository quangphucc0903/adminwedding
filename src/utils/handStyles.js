export const handleStyle = (vertical, horizontal) => {
  if (vertical !== 'center' && horizontal !== 'center') {
    return cornerHandleStyle(vertical, horizontal);
  }

  if (vertical === 'top' && horizontal === 'center') {
    return topHandleStyle();
  }

  if (vertical === 'bottom' && horizontal === 'center') {
    return bottomHandleStyle();
  }

  if (horizontal === 'left') {
    return leftHandleStyle();
  }

  if (horizontal === 'right') {
    return rightHandleStyle();
  }
};


const cornerHandleStyle = (vertical, horizontal) => ({
  position: 'absolute',
  width: 5,
  height: 5,
  backgroundColor: '#2196f3',
  cursor: cursorStyle(vertical, horizontal),
  [vertical]: -3, 
  [horizontal]: -3,
});

const topHandleStyle = () => ({
  position: 'absolute',
  width: 5,
  height: 5,
  borderRadius: '50%',
  backgroundColor: '#2196f3',
  cursor: 'ns-resize',
  top: 0,
  left: '50%',
  transform: 'translate(-50%, -50%)', 
});

const bottomHandleStyle = () => ({
  position: 'absolute',
  width: 5,
  height: 5,
  borderRadius: '50%',
  backgroundColor: '#2196f3',
  cursor: 'ns-resize',
  bottom: 0, 
  left: '50%', 
  transform: 'translate(-50%,50%)', 
});

const leftHandleStyle = () => ({
  position: 'absolute',
  width: 5,
  height: 5,
  borderRadius: '50%',
  backgroundColor: '#2196f3',
  cursor: 'ew-resize',
  left: 0,
  top: '50%', 
  transform: 'translate(-60%, -50%)', 
});

const rightHandleStyle = () => ({
  position: 'absolute',
  width: 5,
  height: 5,
  borderRadius: '50%',
  backgroundColor: '#2196f3',
  cursor: 'ew-resize',
  right: 0, 
  top: '50%', 
  transform: 'translate(60%, -50%)', 
});

const cursorStyle = (vertical, horizontal) => {
  if (vertical === 'top' && horizontal === 'left') return 'nwse-resize';
  if (vertical === 'top' && horizontal === 'right') return 'nesw-resize';
  if (vertical === 'bottom' && horizontal === 'left') return 'nesw-resize';
  if (vertical === 'bottom' && horizontal === 'right') return 'nwse-resize';
  if (vertical === 'top' || vertical === 'bottom') return 'ns-resize';
  if (horizontal === 'left' || horizontal === 'right') return 'ew-resize';
};
