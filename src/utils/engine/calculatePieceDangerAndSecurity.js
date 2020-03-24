import pieceValues from 'constants/values';

export default function calculatePieceDangerAndSecurity(
  rating,
  turn,
  { attackedBy, defendedBy, contains: piece }
) {
  let attackersC = attackedBy.length;
  let defendersC = defendedBy.length;

  if (attackersC === 0) {
    //no attackers
    rating.pieceSecurity += defendersC;
    return;
  }

  if (attackersC > 0 && defendersC === 0) {
    //atttackers with no defenders
    //if a piece is hanging but it is your turn the position isnt bad because you can move
    //if you have a piece hanging but the oppenent does too you shouldnt get the benefit of their hanging piece
    //if you have 2 pieces hanging and cant defend them with one move you lose the power of the weaker piece
    if (piece.colour === turn) {
      return;
    }

    rating.pieceDanger -= pieceValues.get(piece.name);
    return;
  }

  //attackers and defenders
  //see if the attackers are worth it because they may be easily captured
  let attackers = attackedBy
    .map(checkAttackerValidity)
    .filter((x) => x !== undefined)
    .sort((a, b) => a - b);

  let defenders = defendedBy
    .map(getPieceValueOnSquare)
    .filter((x) => x !== undefined)
    .sort((a, b) => b - a);

  let pieceContentionScore = pieceValues.get(piece.name);

  attackers.forEach((attacker, i) => {
    if (defendersC > 0) {
      pieceContentionScore -= attacker;
      defendersC--;

      if (pieceContentionScore > 0) {
        //piece defended but by a more valuable piece(s) OR piece attacked by a less valueable piece
        rating.pieceDanger -= pieceContentionScore;
        attackedBy.forEach((attackerSquare) => {
          let attacker = attackerSquare.contains;
          let attackerMoves = attackerSquare.possibleMoves;

          if (attackerMoves.length > 1) {
            let piecesInDanger = attackerMoves.map((move) =>
              getPieceValueOnSquare(move, attacker)
            );

            piecesInDanger = piecesInDanger.map((value) => {
              if (!value) {
                return Math.min(...piecesInDanger.filter((x) => x));
              } else {
                return value;
              }
            });

            piecesInDanger.sort((a, b) => a - b);

            rating.pieceDanger -= piecesInDanger[0] * 1.5;
          }
        });
      } else if (i <= attackersC) {
        pieceContentionScore += defenders[defendersC];
      }
    } else if (pieceContentionScore - attacker >= 0) {
      rating.pieceDanger -= pieceContentionScore;
    }
  });

  if (pieceContentionScore < 0) {
    //piece defended
    rating.pieceSecurity += 1;
  }

  function checkAttackerValidity(square) {
    //returns a value if the attacker is directly a threat to the piece. It is not a threat if it can
    //be captured freely before it attacks or if it captures it is actually better for the side it is capturing
    const attacker = square.contains;

    //If the attacker can move this turn it is a threat
    if (attacker.colour === turn) {
      return getPieceValueOnSquare(square);
    }

    if (square.attackedBy.length === 0) {
      //if the attacker is unattacked it is a threat
      return getPieceValueOnSquare(square);
    } else if (square.defendedBy.length === 0) {
      //if the attacker is attacked and undefended dont count it
      return;
    } else {
      //if the attacker has a defender
      const attackers = square.attackedBy
        .map(getPieceValueOnSquare)
        .sort((a, b) => a - b);

      const defenders = square.defendedBy
        .map(getPieceValueOnSquare)
        .sort((a, b) => a - b);

      const pieceContentionScore = pieceValues.get(attacker.name);
      const tradeValue = tradeEvaluation(
        attackers,
        defenders,
        pieceContentionScore
      );

      if (tradeValue > 0) {
        //attacking piece is capturable at a benefit to the enemy
        return;
      } else if (tradeValue < 0) {
        //piece defended or bad to capture
        return getPieceValueOnSquare(square);
      } else {
        //toss up. go with agression of computer
        return getPieceValueOnSquare(square);
      }
    }
  }

  function tradeEvaluation(attackers, defenders, pieceContentionScore) {
    //see if the attacking piece in question has move valuable attackers or defenders.
    let defendersC = defenders.length;
    const attackersC = attackers.length;

    attackers.forEach((attacker, i) => {
      if (defendersC > 0) {
        pieceContentionScore -= attacker;

        if (pieceContentionScore > 0) {
          //piece defended but by a more valuable piece(s) OR piece attacked by a less valueable piece
          return pieceContentionScore;
        } else if (i <= attackersC) {
          //if we arent done with attackers, add value of defenders
          pieceContentionScore += defenders.shift();
        }
      }
    });

    return pieceContentionScore;
  }

  function getPieceValueOnSquare(square, attacker = null) {
    const piece = square.contains ?? attacker;
    return pieceValues.get(piece.name);
  }
}
