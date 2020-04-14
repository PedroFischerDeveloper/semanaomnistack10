import React from 'react';
import {StatusBar, YellowBox} from 'react-native';
import Routes from './src/Routes';


YellowBox.ignoreWarnings([
  'Unrecognized WebSocket'
]);

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor='#7d40e7'/>
      <Routes/>
    </>
  );
}

export default App;
