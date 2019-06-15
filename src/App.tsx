import React from 'react';
import './App.css';
import CardBoardPresentation from './components/CardField';
import MatchingCardsGame, { MatchingCardPlayer } from './components/MatchingCardsGame';

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
            hideTimeout: 250,
          }}
      />
    </>
  );
}

export default App;
