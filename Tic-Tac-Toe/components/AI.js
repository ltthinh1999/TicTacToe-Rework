function isWinningStreak(a, b, c) {
    return a == b && b == c && a != 0;
}

function checkState(table) {
    let winner = 999;

    for (let i = 0; i < 3; i++) {
        if (isWinningStreak(table[i][0], table[i][1], table[i][2])) {
            winner = table[i][0];
        }
    }

    for (let i = 0; i < 3; i++) {
        if (isWinningStreak(table[0][i], table[1][i], table[2][i])) {
            winner = table[0][i];
        }
    }

    if (isWinningStreak(table[0][0], table[1][1], table[2][2])) {
        winner = table[0][0];
    }
    if (isWinningStreak(table[2][0], table[1][1], table[0][2])) {
        winner = table[2][0];
    }
    let turnsLeft = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (table[i][j] == 0) {
                turnsLeft++;
            }
        }
    }
    if (winner == 999 && turnsLeft == 0) {
        return 0;
    }
    return winner;
}

function aiTurn(table) {
    let score = -Infinity;
    let bestMove;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (table[i][j] == 0) {
                table[i][j] = 1;
                let tmp = minimax(table, 0, false);
                table[i][j] = 0;
                if (tmp > score) {
                    score = tmp;
                    bestMove = { i, j };
                }
            }
        }
    }

    table[bestMove.i][bestMove.j] = 1;
    return bestMove;
}

function minimax(table, depth, isMax) {
    let winner = checkState(table);
    if (winner != 999) {
        return winner;
    }

    if (isMax) {
        let score = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (table[i][j] == 0) {
                    table[i][j] = 1;
                    let tmp = minimax(table, depth + 1, false);
                    table[i][j] = 0;
                    score = Math.max(tmp, score);
                }
            }
        }
        return score;
    } else {
        let score = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (table[i][j] == 0) {
                    table[i][j] = -1;
                    let tmp = minimax(table, depth + 1, true);
                    table[i][j] = 0;
                    score = Math.min(tmp, score);
                }
            }
        }
        return score;
    }
}

export default aiTurn;