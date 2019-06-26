import React from 'react';
import './App.css';
import DialogView from './components/dialog/dialogView';
import MatchingCardsSinglePlayerGameController from './components/cards/MatchingCardsSinglePlayerGameController';

const App: React.FC = () => {
  return (
    <>
      <MatchingCardsSinglePlayerGameController 
      />
      <DialogView />
    </>
  );
}

export default App;
