"use strict";

// ポーズ、リスタートボタン
let isPaused = false;
// ゲームループ
function gameLoop() {
  if (!isPaused) {
    // ゲームの更新コード
  }
  requestAnimationFrame(gameLoop);
}

// ポーズ
document.getElementById("pause").addEventListener("click", function () {
  isPaused = !isPaused;
});
// リスタート
document.getElementById("retry").addEventListener("click", function () {
  // ゲームの初期化の状態
  isPaused = true; //一時停止
});

// ゲーム再開
gameLoop();
