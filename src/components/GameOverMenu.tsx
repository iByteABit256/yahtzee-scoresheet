import React from "react";
import "./GameOverMenu.css";
import { Player } from "../models/player";
import { Button } from "./Button";

interface IGameOverMenu {
  players: Player[];
  onStartNewGame: () => void;
}

export const GameOverMenu: React.FC<IGameOverMenu> = (props) => {
  return (
    <div className="game-over-menu">
      <div className="game-over-menu__content">
        <h2>Game Over</h2>
        <h3>Scores</h3>
        <ul className="game-over-menu__player-list">
          {props.players.length > 0 && (
            <li>
              <div className="game-over-menu__player-name">Name </div>
              <div className="game-over-menu__player-score">Score</div>
            </li>
          )}
          {props.players.map((p) => {
            return (
              <li key={p.id}>
                <div className="game-over-menu__player-name game-over-menu__player-name-value">
                  {p.name}
                </div>
                <div className="game-over-menu__player-score game-over-menu__player-score-value">
                  {p.scores.total || 0}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="no-content">
          <Button onClick={props.onStartNewGame}>New Game</Button>
        </div>
      </div>
    </div>
  );
};
