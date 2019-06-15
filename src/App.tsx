import React from 'react';
import './App.css';
import CardBoardPresentation from './components/cards/CardField';
import MatchingCardsGame, { MatchingCardPlayer } from './components/cards/MatchingCardsGame';

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
