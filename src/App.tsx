import React from 'react';
import './App.css';
import CardBoardPresentation from './components/cards/CardField';
import MatchingCardsGame, { MatchingCardPlayer } from './components/cards/MatchingCardsGame';
import DialogView from './components/dialog/dialogView';

const App: React.FC = () => {
  return (
    <>
      <MatchingCardsGame
          players={[
            new MatchingCardPlayer("Player#1"),
          ]}
          level={4} 
          Presentation={CardBoardPresentation}
          cardType="numbers"
          settings={{
            hideIfFailedTimeout: 1000,
            hideIfSucceedTimeout: 500,
            timeForRemoveCards: 250,
          }}
      />
      <DialogView />
    </>
  );
}

export default App;
