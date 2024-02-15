import React, { Fragment, useMemo, useRef, useState } from 'react';
import { render } from 'react-dom';

const WORK_TIME = 1200;
const REST_TIME = 20;

const SOUND_SRC = './sounds/bell.wav';

const formatTime = (seconds) => {
  let minutes = 0;
  while (seconds >= 60) {
    seconds -= 60;
    minutes++;
  }
  return `${('00' + minutes).slice(-2)}:${('00' + seconds).slice(-2)}`;
};

const App = () => {
  const [state, setState] = useState({
    status: 'off',
    time: 0,
  });

  const timer = useRef();

  const handleStart = () => {
    setState({
      status: 'work',
      time: WORK_TIME,
    });

    timer.current = setInterval(() => {
      setState((state) => {
        if (state.time > 0) {
          state.time--;
        }
        if (state.time === 0) {
          Audio(SOUND_SRC).play();
          if (state.status === 'work') {
            state.status = 'rest';
            state.time = REST_TIME;
          } else if (state.status === 'rest') {
            state.status = 'work';
            state.time = WORK_TIME;
          }
        }
        return { ...state };
      });
    }, [1000]);
  };

  const handleStop = () => {
    clearInterval(timer.current);
    setState({
      status: 'off',
      time: 0,
    });
  };

  const closeApp = () => window.close();

  const timeValue = useMemo(() => formatTime(state.time), [state]);

  return (
    <div>
      <h1>Protect your eyes</h1>
      {state.status === 'off' && (
        <Fragment>
          <p>
            According to optometrists in order to save your eyes, you should
            follow the 20/20/20. It means you should to rest your eyes every 20
            minutes for 20 seconds by looking more than 20 feet away.
          </p>
          <p>
            This app will help you track your time and inform you when it's time
            to rest.
          </p>
        </Fragment>
      )}
      {state.status === 'work' && <img src='./images/work.png' />}
      {state.status === 'rest' && <img src='./images/rest.png' />}
      {state.status !== 'off' && <div className='timer'>{timeValue}</div>}
      {state.status === 'off' && (
        <button onClick={handleStart} className='btn'>
          Start
        </button>
      )}
      {state.status !== 'off' && (
        <button onClick={handleStop} className='btn'>
          Stop
        </button>
      )}
      <button onClick={closeApp} className='btn btn-close'>
        X
      </button>
    </div>
  );
};

render(<App />, document.querySelector('#app'));
