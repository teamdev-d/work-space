const canMove = (moveX, moveY, newTet = tetroMino) => {
  for (let y = 0; y < TET_SIZE; y++) {
    for (let x = 0; x < TET_SIZE; x++) {
      if (newTet[y][x]) {
        // 現在のテトリミノの位置（tetroMinoDistanceX + x）に移動分を加える（＝移動後の座標）
        let nextX = tetroMinoDistanceX + x + moveX;
        let nextY = tetroMinoDistanceY + y + moveY;

        //----------------------------------------

        // 移動先にブロックがあるか判定
        if (
          nextY < 0 ||
          nextX < 0 ||
          nextY >= PLAY_SCREEN_HEIGHT ||
          nextX >= PLAY_SCREEN_WIDTH ||
          SCREEN[nextY][nextX]
        ) {
          return false;
        }
      }
    }
  }
        //----------------------------------------
  return true;
};
