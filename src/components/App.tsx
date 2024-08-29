import React, { useState } from "react";
import "./App.css";
import { Game } from "../models/game";
import { Player, PlayerData } from "../models/player";
import { ScoreSheet } from "./ScoreSheet";
import { GameMenu } from "./GameMenu";
import { Button } from "./Button";
import { GameOverMenu } from "./GameOverMenu";

const storageKey = "yahtzeegame";

const loadGame = () => {
  const data = localStorage.getItem(storageKey);
  if (!data) return undefined;
  const game = JSON.parse(data);
  // rehydrate class instances
  game.players = game.players.map((p: PlayerData) => Player.fromData(p));
  return new Game(game);
};

const saveGame = (game: Game) => {
  localStorage.setItem(storageKey, JSON.stringify(game));
};

interface IGameContext {
  game?: Game;
  updateGame: (game: Game) => void;
}

export const GameContext = React.createContext<IGameContext>({
  game: loadGame(),
  updateGame: () => {
    return;
  },
});

export const App: React.FC = () => {
  const [game, setGame] = useState<Game | undefined>(loadGame());
  const [menuVisible, setMenuVisible] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const updateGame = (game: Game) => {
    saveGame(game);
    setGame(game);
  };

  const showMenu = () => setMenuVisible(true);
  const hideMenu = () => setMenuVisible(false);

  const startNewGame = (shouldCreateGame: boolean) => {
    if (shouldCreateGame) {
      updateGame(new Game());
    }
    showMenu();
    setGameOver(false);
  };

  const canEndGame =
    !gameOver &&
    game &&
    game?.players &&
    game?.players.length > 0 &&
    game.players.every((p) => p.canEndGame());

  const endGame = () => setGameOver(true);

  return (
    <React.StrictMode>
      <GameContext.Provider value={{ game, updateGame }}>
        <main className="app">
          <header className="header">
            <h1>Yahtzee</h1>
            {canEndGame && <Button onClick={endGame}>End Game</Button>}
            <Button onClick={showMenu}>Players</Button>
          </header>
          <div className="body">
            {game ? (
              <div className="content">
                {!gameOver ? (
                  <ScoreSheet />
                ) : (
                  <GameOverMenu
                    players={game?.players}
                    onStartNewGame={() => startNewGame(false)}
                  />
                )}
              </div>
            ) : (
              <div className="no-content">
                <Button onClick={() => startNewGame(true)}>New Game</Button>
              </div>
            )}
          </div>
          <GameMenu onClose={hideMenu} isOpen={menuVisible} />
        </main>
      </GameContext.Provider>
    </React.StrictMode>
  );
};
