// テトリミノの1辺の最長
const TET_SIZE = 4;

// 7種類のテトリミノ
let TETRO_TYPES = [
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
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
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

// TETRO_TYPESのインデックス番号をランダム取得
let tetroTypesIndex = Math.floor(Math.random() * 7);

// テトロミノを取得する
let tetroMino = TETRO_TYPES[tetroTypesIndex];

// テトリスプレイ画面描画処理
const drawPlayScreen = () => {
  // 背景色を黒に指定
  CANVAS_2D.fillStyle = "#000";

  // キャンバスを塗りつぶす
  CANVAS_2D.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // 塗りに赤を設定
  CANVAS_2D.fillStyle = "#E33";
  // x,y =100, 100の場所に30×30のブロックを描画
  CANVAS_2D.fillRect(100, 100, BLOCK_SIZE, BLOCK_SIZE);

  // テトリミノを描画する
  for (let y = 0; y < TET_SIZE; y++) {
    for (let x = 0; x < TET_SIZE; x++) {
      if (tet[y][x]) {
        CANVAS_2D.fillRect(
          x * BLOCK_SIZE,
          y * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
      }
    }
  }
};

// 画面を真ん中にする
const CONTAINER = document.getElementById("container");
CONTAINER.style.width = CANVAS_WIDTH + "px";

// 初期化処理
const init = () => {
  drawPlayScreen();
};
