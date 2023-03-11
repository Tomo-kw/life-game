'use strict';
const GRID_WIDTH = 16;
const GRID_HEIGHT = 16;
// セルの状態をもつ変数
let cells = [];

// 細胞クラス・セルの生死状態
class Cell {
  // 生きている：isAlive
  constructor(isAlive) {
    this.isAlive = isAlive
  }
}

main();

// エントリポイント
function main() {
  // 進むボタンが押されたら
  $('#next').on('click', function() {
    // セルの状態を進める
    stepCellState();
  })

  // エリアを描画する
  drawArea();

  // セルの初期状態設定：配列で全て死にする：false
  createCells(cells);

  // セルの表示を更新
  updateCell();

  // クリックしたセルの生存を反転させる
  $('td').on('click', function() {
    let x = $(this).attr('x')
    let y = $(this).attr('y')
    // console.log(x)
    // console.log(y)
    cells[y][x].isAlive = cells[y][x].isAlive ? false : true;
    updateCell()
  })

}

 // エリアを描画する
function drawArea() {
  $('table.cells').empty();

  for (let y = 0; y < GRID_HEIGHT; y++) {
    let row = $('<tr>')
    for (let x = 0; x < GRID_WIDTH; x++) {
      let col = $('<td x=' + x + ' y=' + y + '>');
      row.append(col);
    }
    $('table.cells').append(row);
  }

}

// セルの状態作成
function createCells(cells) {
  for(let y = 0; y < GRID_HEIGHT; y++) {
    let cellRow = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      // セルの初期状態は死亡
      let cell = new Cell(false)
      cellRow.push(cell)
    }
    cells.push(cellRow)
  }
  // console.log(cells)
}

// セルの状態を更新
function updateCell() {
  for(let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      let elem = $('td[x= ' + x + '][y=' + y + ']')
      if(cells[y][x].isAlive) {
        elem.removeClass('death')
        elem.addClass('alive')
      } else {
        elem.removeClass('alive')
        elem.addClass('death')
      }
    }
  }
}

// セルの状態を進める
function stepCellState() {
  console.log('next');

  // 次ターンのセルの状態
  let nextStepSell = [];
  // 初期化？
  createCells(nextStepSell);
  
  for(let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      nextStepSell[y][x].isAlive = checkCellAlive(x, y);
    }
  }

  cells = nextStepSell;
  updateCell()
}

// セルの生死の判断を行う
function checkCellAlive(x, y) {
  let result = false;

  // 周りに幾つ生きているセルがいるかを判定
  let aliveCount = 0;

  // 左上
  if (x > 0 && y > 0 && cells[y-1][x-1].isAlive) {
    aliveCount++;
  }

  // 左
  if (x > 0 && cells[y][x-1].isAlive) {
    aliveCount++;
  }
  
  // 左下
  if (x > 0 && y <= GRID_HEIGHT - 2 && cells[y+1][x-1].isAlive) {
    aliveCount++;
  }

  // 下
  if (y <= GRID_HEIGHT - 2 && cells[y+1][x].isAlive) {
    aliveCount++;
  }

  // 右下
  if (x <= GRID_WIDTH - 2 && y <= GRID_HEIGHT - 2 && cells[y+1][x+1].isAlive) {
    aliveCount++;
  }

  // 右
  if (x <= GRID_WIDTH - 2 && cells[y][x+1].isAlive) {
    aliveCount++;
  }

  // 右上
  if(x <= GRID_WIDTH - 2 && y > 0 && cells[y-1][x+1].isAlive) {
    aliveCount++;
  }
  // 上
  if(y > 0 && cells[y-1][x].isAlive) {
    aliveCount++;
  }
  // 【判定】誕生・生存・過疎・過密→生きたセルの数による
  if (!cells[y][x].isAlive && aliveCount === 3) {
    // 誕生
    result = true
  } else if (cells[y][x].isAlive && (aliveCount === 2 || aliveCount === 3)) {
    // 生存
    result = true
  } else if (cells[y][x].isAlive && aliveCount <= 1) {
    // 過疎
    return false
  } else if (cells[y][x].isAlive && aliveCount >= 4) {
    // 過密
    return false
  }
  
  return result
}