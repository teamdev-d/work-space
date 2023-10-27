// 落下スピード
const DROP_SPEED = 300;

// 1ブロックの大きさ
const BLOCK_SIZE = 30;

// フィールドのサイズ
const PLAY_SCREEN_WIDTH = 10;
const PLAY_SCREEN_HEIGHT = 20;

// キャンバスIDの取得
const CANVAS = document.getElementById("canvas");

// 2dコンテキストの取得
const CANVAS_2D = CANVAS.getContext("2d");

// キャンバスサイズ（＝プレイ画面のサイズ）
const CANVAS_WIDTH = BLOCK_SIZE * PLAY_SCREEN_WIDTH;
const CANVAS_HEIGHT = BLOCK_SIZE * PLAY_SCREEN_HEIGHT;
CANVAS.width = CANVAS_WIDTH;
CANVAS.height = CANVAS_HEIGHT;

// テトリミノの1辺の最長
const TET_SIZE = 4;

// 7種類のテトリミノ達
let TETRO_TYPES = [
  [],
  [
    // Z
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [
    // S
    [0, 0, 0, 0],
    [0, 0, 1, 1],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [
    // I
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    // J
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [
    // L
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [
    // T
    [0, 0, 0, 0],
    [1, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    // O
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
];

const tetColors = [
  "",
  "#fde047", // yellow
  "#4ade80", // green
  "#DC3545", // red
  "#FFC107", // orange
  "#0ea5e9", // blue
  "#8b5cf6", // purple
  "#DC3545", // red
];

// TETRO_TYPESのインデックス番号をランダム取得
let tetroTypesIndex = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;

// テトロミノを取得する
let tetroMino = TETRO_TYPES[tetroTypesIndex];

// テトリミノの移動距離
let tetroMinoDistanceX = 0;
let tetroMinoDistanceY = 0;

// 画面本体
const SCREEN = [];

// タイマーID
let timerId = null;

// ゲームオーバーフラグ
let isGameOver = false;

// テトリスプレイ画面描画処理
const drawPlayScreen = () => {
  // 背景色を指定
  CANVAS_2D.fillStyle = "#e5e7eb";

  // キャンバスを塗りつぶす
  CANVAS_2D.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // 画面本体で動かせなくなったテトリミノを描画する
  for (let y = 0; y < PLAY_SCREEN_HEIGHT; y++) {
    // 画面本体の高さ分繰り返す
    for (let x = 0; x < PLAY_SCREEN_WIDTH; x++) {
      // 画面本体の幅分繰り返す
      if (SCREEN[y][x]) {
        // 画面本体の座標にブロックがある場合
        drawBlock(x, y, SCREEN[y][x]); // ブロックを描画する
      }
    }
  }

  // テトリミノを描画する
  for (let y = 0; y < TET_SIZE; y++) {
    for (let x = 0; x < TET_SIZE; x++) {
      if (tetroMino[y][x]) {
        drawBlock(
          tetroMinoDistanceX + x,
          tetroMinoDistanceY + y,
          tetroTypesIndex
        );
      }
    }
  }

  // ゲームオーバー時のメッセージ
  if (isGameOver) {
    const GAME_OVER_MESSAGE = "GAME OVER";
    CANVAS_2D.font = "40px 'dotgothic16";
    const width = CANVAS_2D.measureText(GAME_OVER_MESSAGE).width;
    const x = CANVAS_WIDTH / 2 - width / 2;
    const y = CANVAS_HEIGHT / 2 - 20;
    CANVAS_2D.fillStyle = "black";
    CANVAS_2D.fillText(GAME_OVER_MESSAGE, x, y);
  }
};

// ブロックを描画する
const drawBlock = (x, y, tetroTypesIndex) => {
  let drawX = x * BLOCK_SIZE;
  let drawY = y * BLOCK_SIZE;

  // 塗りに赤を設定
  CANVAS_2D.fillStyle = tetColors[tetroTypesIndex];
  CANVAS_2D.fillRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
  // 線の色を黒に設定
  CANVAS_2D.strokeStyle = "black";
  CANVAS_2D.strokeRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
};

// テトリミノが動けるかどうか判定する
const canMove = (moveX, moveY, newTet = tetroMino) => {
  for (let y = 0; y < TET_SIZE; y++) {
    for (let x = 0; x < TET_SIZE; x++) {
      if (newTet[y][x]) {
        // 現在のテトリミノの位置（tetroMinoDistanceX + x）に移動分を加える（＝移動後の座標）
        let nextX = tetroMinoDistanceX + x + moveX;
        let nextY = tetroMinoDistanceY + y + moveY;

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
  return true;
};

// 右回転
const createRightRotateTet = () => {
  //回転後の新しいテトリミノ用配列
  let newTet = [];
  for (let y = 0; y < TET_SIZE; y++) {
    newTet[y] = [];
    for (let x = 0; x < TET_SIZE; x++) {
      newTet[y][x] = tetroMino[TET_SIZE - 1 - x][y];
    }
  }
  return newTet;
};

// 左回転
const createLeftRotateTet = () => {
  //回転後の新しいテトリミノ用配列
  let newTet = [];
  for (let y = 0; y < TET_SIZE; y++) {
    newTet[y] = [];
    for (let x = 0; x < TET_SIZE; x++) {
      newTet[y][x] = tetroMino[x][TET_SIZE - 1 - y];
    }
  }
  return newTet;
};

// キーボード入力
document.onkeydown = (e) => {
  if (isGameOver) return;
  switch (e.code) {
    case "ArrowLeft":
      if (canMove(-1, 0)) tetroMinoDistanceX--;
      break;
    case "ArrowRight":
      if (canMove(1, 0)) tetroMinoDistanceX++;
      break;
    case "ArrowDown":
      if (canMove(0, 1)) tetroMinoDistanceY++;
      break;
    case "ArrowUp":
      let newRTet = createRightRotateTet();
      if (canMove(0, 0, newRTet)) {
        tetroMino = newRTet;
      }
      break;
    // case "KeyR":
    //   let newRTet = createRightRotateTet();
    //   if (canMove(0, 0, newRTet)) {
    //     tetroMino = newRTet;
    //   }
    // break;
    // case "KeyL":
    //   let newLTet = createLeftRotateTet();
    //   if (canMove(0, 0, newLTet)) {
    //     tetroMino = newLTet;
    //   }
    //   break;
  }
  drawPlayScreen();
};

// テトリミノを固定する
const fixTet = () => {
  for (let y = 0; y < TET_SIZE; y++) {
    for (let x = 0; x < TET_SIZE; x++) {
      if (tetroMino[y][x]) {
        SCREEN[tetroMinoDistanceY + y][tetroMinoDistanceX + x] =
          tetroTypesIndex;
      }
    }
  }
};

// そろった行を消す
const clearLine = () => {
  // 一列になっている場所をスクリーン上から調べていく
  for (let y = 0; y < PLAY_SCREEN_HEIGHT; y++) {
    // 行を消すフラグを立てる
    let isClearLine = true;
    // 行に0が入っている（＝そろっていない）かを調べていく
    for (let x = 0; x < PLAY_SCREEN_WIDTH; x++) {
      if (SCREEN[y][x] === 0) {
        isClearLine = false;
        break;
      }
    }
    if (isClearLine) {
      // そろった行から上へ向かってforループしていく
      for (let newY = y; newY > 0; newY--) {
        for (let newX = 0; newX < PLAY_SCREEN_WIDTH; newX++) {
          // 一列上の情報をコピーする
          SCREEN[newY][newX] = SCREEN[newY - 1][newX];
        }
      }
      lineCount += 1;
    }
  }

  calculateScore(lineCount);
  drawInfo();
};

// 消したライン数
let lineCount = 0;
// スコア計算結果
let result = 0;

// スコアを計算する関数
function calculateScore(lineCount) {
  result = lineCount * 100;
}

// スコアと消したライン数の表示を行う関数
function drawInfo() {
  // ここでメソットごと代入するとループ2回まわるので変数で代入
  document.getElementById("scoreCount").innerHTML = result;
  document.getElementById("lineCount").innerHTML = lineCount;
}

// 落下処理
const dropTet = () => {
  if (isGameOver) return; // ゲームオーバー時は何もしない
  if (canMove(0, 1)) {
    // 下に移動できるか判定
    tetroMinoDistanceY++; // 下に移動
  } else {
    // 下に移動できない場合
    fixTet(); // テトリミノを固定する
    clearLine(); // そろった行を消す
    tetroTypesIndex = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1; // テトリミノの種類をランダムに取得
    tetroMino = TETRO_TYPES[tetroTypesIndex]; // テトリミノを取得する
    createTetPosition(); // テトリミノの初期位置を設定する
    // 次のテトリミノを出せなくなったらゲームオーバー
    if (!canMove(0, 0)) {
      isGameOver = true; // ゲームオーバーフラグを立てる
      // テトリミノが動けるか判定
      console.log("GAME OVER");
      clearInterval(timerId);
    }
  }
  drawPlayScreen();
};

// 画面を真ん中にする
const BOARD = document.getElementById("board");
BOARD.style.width = CANVAS_WIDTH + "px"; // ボードの幅をキャンバスの幅に合わせる

// テトリミノの初期位置を設定する
const createTetPosition = () => {
  tetroMinoDistanceX = PLAY_SCREEN_WIDTH / 2 - TET_SIZE / 2;
  tetroMinoDistanceY = 0;
};

// 初期化処理
const init = () => {
  if (timerId !== null) {
    clearInterval(timerId);
  }

  for (let y = 0; y < PLAY_SCREEN_HEIGHT; y++) {
    SCREEN[y] = [];
    for (let x = 0; x < PLAY_SCREEN_WIDTH; x++) {
      SCREEN[y][x] = 0;
    }
  }

  // ポーズ状態をリセット
  isPaused = false;
  pauseButton.innerHTML = '<i class="fas fa-pause"></i> 一時停止';

  createTetPosition();

  // 落下処理実行
  timerId = setInterval(dropTet, DROP_SPEED);
  drawPlayScreen();
};

// reInit関数
const reInit = () => {
  if (timerId !== null) {
    clearInterval(timerId);
  }
  // ゲームオーバー状態をリセット
  isGameOver = false;

  // 画面本体の初期化
  for (let y = 0; y < PLAY_SCREEN_HEIGHT; y++) {
    for (let x = 0; x < PLAY_SCREEN_WIDTH; x++) {
      SCREEN[y][x] = 0;
    }
  }
  // テトリミノのランダムな選択
  tetroTypesIndex = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;
  // 位置の初期化
  createTetPosition();

  // 画面を再描画
  drawPlayScreen();
  // 消したライン数をリセット
  lineCount = 0;
  // スコアをリセット
  result = 0;
  // スコアと消したライン数の表示をリセット
  drawInfo();
  // ポーズ状態をリセット
  isPaused = false;
  // ポーズボタンの表示をリセット
  pauseButton.innerHTML = '<i class="fas fa-pause"></i> 一時停止';
};

// ゲームスタート時の初期化
document.getElementById("start").addEventListener("click", function () {
  console.log(isGameOver);
  if (isGameOver) {
    // ゲームオーバー状態から再スタートする場合
    reInit();
  } else {
    init();
  }
});

// ゲームリスタート時の初期化
document.getElementById("restart").addEventListener("click", function () {
  reInit();
});

// Pauseボタンの取得
const pauseButton = document.getElementById("pause");

// ポーズ状態のフラグ
let isPaused = false;

// Pauseボタンがクリックされたときの処理
pauseButton.addEventListener("click", function () {
  if (isPaused) {
    // ゲームがポーズ中なら再開
    isPaused = false;
    // タイマー再開
    timerId = setInterval(dropTet, DROP_SPEED);
    pauseButton.innerHTML = '<i class="fas fa-pause"></i> 一時停止';
  } else {
    // ゲームが実行中ならポーズ
    isPaused = true;
    // タイマー停止
    clearInterval(timerId);
    pauseButton.innerHTML = '<i class="fas fa-play"></i> 再開 ';
  }
});

// モーダルが開かれたときの処理 (JQueryを使用)
$("#manualModal, #confirmModal").on("show.bs.modal", function () {
  console.log("modal opened");
  clearInterval(timerId);
  isPaused = true;
  pauseButton.innerText = "再開 ▶";
});

// モーダルが閉じたときの処理 (JQueryを使用)
$("#manualModal, #confirmModal").on("hidden.bs.modal", function () {
  console.log("modal closed");
  if (!isGameOver) {
    // ゲームオーバーでなければ、ゲームのタイマーを再開
    timerId = setInterval(dropTet, DROP_SPEED);
    isPaused = false;
    pauseButton.innerHTML = '<i class="fas fa-pause"></i> 一時停止';
  }
});


//次のテトリミノを表示する
// 次のテトリミノを表示するキャンバス要素を取得
const nextBlockCanvas = document.getElementById("next-block");

// 2Dコンテキストを取得
const nextBlockCanvasContext = nextBlockCanvas.getContext("2d");

// 次のテトリミノの種類をランダムに取得
const nextTetroTypesIndex = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;

// 次のテトリミノを描画する関数
const drawNextTet = () => {
  // テトリミノの大きさ
  const TETRO_SIZE = 1;

  // ブロックのサイズ
  const BLOCK_SIZE = nextBlockCanvas.width / TETRO_SIZE;

  // テトリミノの種類
  const nextTetroMino = TETRO_TYPES[nextTetroTypesIndex];

  // ブロックを描画する
  for (let y = 0; y < TETRO_SIZE; y++) {
    for (let x = 0; x < TETRO_SIZE; x++) {
      if (nextTetroMino[y][x]) {
        // 塗りつぶし色を指定
        nextBlockCanvasContext.fillStyle = tetColors[nextTetroTypesIndex];
        // ブロックを描画
        nextBlockCanvasContext.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        // 線の色を指定
        nextBlockCanvasContext.strokeStyle = "black";
        // ブロックの枠線を描画
        nextBlockCanvasContext.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
};

// ゲーム開始時に次のテトリミノを描画
drawNextTet();