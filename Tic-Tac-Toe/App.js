import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Dimensions, StyleSheet, ToastAndroid } from 'react-native';
import aiTurn from './components/AI';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.abortTurn = false;

    this.state = {
      mode: "bot",
      running: true,
      playerTurn: true,
      winner: 0
    };

    this.entities = this.setup();
  }

  setup = () => {
    let table = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];

    let turns = [];

    return {
      table: table,
      turns: turns
    }
  }

  abort = () => {
    this.abortTurn = true;
    this.setState({
      playerTurn: false
    });
    let ai = aiTurn(this.entities.table);
    this.entities.turns.push({ ai });
    winner = this.check(ai.i, ai.j, 1);
    if (winner != 999) {
      this.setState({
        running: false,
        winner: winner
      })
      return;
    };
    this.setState({
      playerTurn: true
    });
  }

  reset = () => {
    this.abortTurn = false;
    this.entities = this.setup();
    this.setState({
      mode: "bot",
      running: true,
      playerTurn: true,
      winner: 0
    });
  }

  duel = (key) => {
    let x = Math.floor(key / 3);
    let y = key % 3;
    if (this.entities.table[x][y] == 0) {
      let move = this.state.playerTurn ? -1 : 1;
      this.entities.table[x][y] = move;
      this.entities.turns.push(key);
      this.setState(prevState => ({
        playerTurn: !prevState.playerTurn
      }));
      let winner = this.check(x, y, move);
      if (winner != 999) {
        this.setState({
          running: false,
          winner: winner
        })
        return;
      };
    }
  }

  tick = key => event => {
    if (this.state.mode == "duel") {
      this.duel(key);
    }
    else if (this.state.mode = "bot") {
      if (this.state.playerTurn) {
        let x = Math.floor(key / 3);
        let y = key % 3;
        if (this.entities.table[x][y] == 0) {
          this.entities.table[x][y] = -1;
          this.entities.turns.push({ x, y });
          let winner = this.check(x, y, -1);
          if (winner != 999) {
            this.setState({
              running: false,
              winner: winner
            })
            return;
          };
          this.setState({
            playerTurn: false
          });
          let ai = aiTurn(this.entities.table);
          this.entities.turns.push({ ai });
          winner = this.check(ai.i, ai.j, 1);
          if (winner != 999) {
            this.setState({
              running: false,
              winner: winner
            })
            return;
          };
          this.setState({
            playerTurn: true
          });
        }
      }
    }
  }

  check(x, y, move) {
    let col, row, dia, rdia;
    col = row = dia = rdia = 0;
    for (let i = 0; i < 3; i++) {
      if (this.entities.table[x][i] == move) {
        col++;
      }
      if (this.entities.table[i][y] == move) {
        row++;
      }
      if (this.entities.table[i][i] == move) {
        dia++;
      }
      if (this.entities.table[i][3 - (i + 1)] == move) {
        rdia++;
      }
    }
    if (row == 3 || col == 3 || dia == 3 || rdia == 3) {
      return move;
    }
    if (this.entities.turns.length == 9) {
      return 0;
    }
    return 999;
  }

  renderMove(key) {
    if (this.entities.table[Math.floor(key / 3)][key % 3] != 0) {
      if (this.entities.table[Math.floor(key / 3)][key % 3] == 1) {
        return <Text style={styles.O}>O</Text>;
      }
      return <Text style={styles.X}>X</Text>;
    }
  }

  renderAbortDialog() {
    if (!this.abortTurn && this.state.mode == "bot") {
      this.abortTurn = true;
      return <TouchableOpacity style={styles.generalWrapper} onPress={this.abort}>
        <Text style={{ fontSize: 16 }}>Tap here to let the opponent go first</Text>
      </TouchableOpacity>
    }
    return <Text style={[{padding: 12, fontSize: 16, margin: 10}]}>Do your best!</Text>;
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={1} key={0} style={[styles.tile, { borderLeftWidth: 0, borderTopWidth: 0 }]} onPress={this.tick(0)}>
            {this.renderMove(0)}
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} key={1} style={[styles.tile, { borderTopWidth: 0 }]} onPress={this.tick(1)}>
            {this.renderMove(1)}
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} key={2} style={[styles.tile, { borderRightWidth: 0, borderTopWidth: 0 }]} onPress={this.tick(2)}>
            {this.renderMove(2)}
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={1} key={3} style={[styles.tile, { borderLeftWidth: 0 }]} onPress={this.tick(3)}>
            {this.renderMove(3)}
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} key={4} style={styles.tile} onPress={this.tick(4)}>
            {this.renderMove(4)}
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} key={5} style={[styles.tile, { borderRightWidth: 0 }]} onPress={this.tick(5)}>
            {this.renderMove(5)}
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={1} key={6} style={[styles.tile, { borderLeftWidth: 0, borderBottomWidth: 0 }]} onPress={this.tick(6)}>
            {this.renderMove(6)}
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} key={7} style={[styles.tile, { borderBottomWidth: 0 }]} onPress={this.tick(7)}>
            {this.renderMove(7)}
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} key={8} style={[styles.tile, { borderRightWidth: 0, borderBottomWidth: 0 }]} onPress={this.tick(8)}>
            {this.renderMove(8)}
          </TouchableOpacity>
        </View>
        {this.renderAbortDialog()}
        {!this.state.running && <TouchableOpacity style={styles.gameOverWrapper} onPress={this.reset}>
          <View style={styles.gameOverView}>
            {this.state.winner == 0 && <Text style={[styles.gameOverText, { fontSize: 24 }]}>Draw</Text>}
            {this.state.winner == 1 && <Text style={[styles.gameOverText, { fontSize: 24 }]}>O wins</Text>}
            {this.state.winner == -1 && <Text style={[styles.gameOverText, { fontSize: 24 }]}>X wins</Text>}
            <Text style={[styles.gameOverText, { fontSize: 12 }]}>Tap to play again</Text>
          </View>
        </TouchableOpacity>}
      </View>
    )
  };
}

const styles = StyleSheet.create({

  wrapper: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    flexDirection: "row",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  generalWrapper: {
    borderWidth: 2,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: 'black',
    backgroundColor: 'white',
    margin: 10,
    padding: 10,
  },

  gameOverWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1
  },

  gameOverView: {
    top: Dimensions.get("screen").height / 2 - 24,
    bottom: Dimensions.get("screen").height / 2 + 48,
    left: 0,
    right: 0,
    backgroundColor: "black",
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },

  gameOverText: {
    color: '#fff'
  },

  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get("screen").width / 3,
    height: Dimensions.get("screen").width / 3,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white'
  },

  O: {
    color: "green",
    fontSize: Dimensions.get("screen").width / 3,
  },

  X: {
    color: "red",
    fontSize: Dimensions.get("screen").width / 3,
  }
})