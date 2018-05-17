// -----------------------------------------
//
// -----------------------------------------
Item = function(el) {

  // 操作する要素
  this.el = el;

  // アニメーションさせる要素
  this.line = this.el.find('.line');
  this.dot = this.el.find('.dot');

  // パラメータ
  this.paramLine = {
    y:0
  }
  this.paramDot = {
    y:0
  }
  this.fric = random(0.2, 1)

};

// 初期化
Item.prototype.init = function() {
};

// 更新
Item.prototype.update = function() {

  var rot = Math.atan2(param.y, param.x)
  TweenMax.set(this.line, {
    scaleY:0 + Math.abs(param.y) * 0.05,
    y:param.y,
    rotationZ:radian(param.y * param.x) * -1
  });

  TweenMax.set(this.dot, {
    x:param.y * this.fric * -1,
    y:param.x * this.fric * -1,
    scale:1 + Math.abs(param.x * param.y) * this.fric * 0.001
  });

  TweenMax.set(this.el, {
    x:param.x * this.fric,
    y:param.y * this.fric
  });

};
// -----------------------------------------


// 動かすやつ
items = [];

// マウス
mouse = {
  isDown:false,     // 画面押されてるか
  x:0,              // マウス位置 X
  y:0,              // マウス位置 Y
  start:{x:0, y:0}, // マウスダウン時の座標
  dist:{x:0, y:0}   // マウスダウンしてからの移動距離
};

// アニメーション用パラメータ
param = {
  x:0,
  y:0,
  d:0
};

// 初期設定
init();
function init() {

  var itemNum = 50;
  for(var i = 0; i< itemNum; i++) {
    $('.mv').append('<div class="item js-tg"><div class="line"></div><div class="dot"><div class="inner"></div></div></div>');
  }

  $('.js-tg').each(function(i,e) {
    var item = new Item($(e));
    item.init();
    items.push(item);
  });

  window.addEventListener('resize', resize);

  if(isMobile.any) {
    document.addEventListener('touchmove', _eMouseMove, {passive:false});
    document.addEventListener('touchstart', _eMouseDown, {passive:false});
    document.addEventListener('touchend', _eMouseUp, {passive:false});
  } else {
    $(window).on('mousemove', _eMouseMove).on('mousedown', _eMouseDown).on('mouseup', _eMouseUp);
  }

  update();
  resize();
}

// 毎フレーム実行
window.requestAnimationFrame(update);
function update() {

  if(mouse.isDown) {
    // マウス押してるときは、マウスダウン時からのマウス移動量をちゃんと計算
    dx = mouse.x - mouse.start.x;
    dy = mouse.y - mouse.start.y;
    mouse.dist.x = dx;
    mouse.dist.y = dy;

    // ##########################################################
    var friction = 0.2; // 摩擦係数 小さいとより引っ張られる感じに
    mouse.dist.x *= friction;
    mouse.dist.y *= friction;
    // ##########################################################

  } else {
    // マウス押してないときの移動量は0
    mouse.dist.x = 0;
    mouse.dist.y = 0;
  }

  // 滑らかに移動させるためイージングつける
  var ease = 0.075; // イージング量 小さいとゆっくり
  param.x += (mouse.dist.x - param.x) * ease;
  param.y += (mouse.dist.y - param.y) * ease;

  // 中心からの距離
  var d = Math.sqrt(param.x * param.x + param.y * param.y);
  param.d += (d - param.d) * ease;

  var len = items.length;
  for(var i = 0; i < len; i++) {
    items[i].update();
  }

  window.requestAnimationFrame(update);
}

// リサイズ
function resize() {

  // 位置ランダムに
  var rangeX = window.innerWidth * 0.5;
  var rangeY = window.innerHeight * 0.5;
  var len = items.length;
  for(var i = 0; i < len; i++) {
    items[i].el.css({
      top:window.innerHeight * 0.5 + random(-rangeY, rangeY),
      left:window.innerWidth * 0.5 + random(-rangeX, rangeX)
    })
  }

}


// ----------------------------------------
// イベント マウス動いた
// ----------------------------------------
function _eMouseMove(e) {

  if(isMobile.any) {
    event.preventDefault();
    touches = event.touches;
    if(touches != null && touches.length > 0) {
      mouse.x = touches[0].pageX;
      mouse.y = touches[0].pageY;
    }
  } else {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

}


// ----------------------------------------
// イベント マウス押した
// ----------------------------------------
function _eMouseDown(e) {

  if(!mouse.isDown) {
    mouse.isDown = true;
    if(isMobile.any) {
      event.preventDefault();
      touches = event.touches;
      if(touches != null && touches.length > 0) {
        mouse.start.x = mouse.x = touches[0].pageX;
        mouse.start.y = mouse.y = touches[0].pageY;
      }
    } else {
      mouse.start.x = e.clientX;
      mouse.start.y = e.clientY;
    }
  }

}


// ----------------------------------------
// イベント マウス離した
// ----------------------------------------
function _eMouseUp(e) {

  mouse.isDown = false;

}




// ########################################
// ユーティリティ系 ↓
// ########################################

// ----------------------------------------
// 度からラジアンに変換
// @val : 度
// ----------------------------------------
function radian(val) {
  return val * Math.PI / 180;
}

// ----------------------------------------
// ラジアンから度に変換
// @val : ラジアン
// ----------------------------------------
function degree(val) {
  return val * 180 / Math.PI;
}

// ----------------------------------------
// minからmaxまでランダム
// ----------------------------------------
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// ----------------------------------------
// 範囲変換
// @val     : 変換したい値
// @toMin   : 変換後の最小値
// @toMax   : 変換後の最大値
// @fromMin : 変換前の最小値
// @fromMax : 変換前の最大値
// ----------------------------------------
function map(val, toMin, toMax, fromMin, fromMax) {
  if(val <= fromMin) {
    return toMin;
  }
  if(val >= fromMax) {
    return toMax;
  }
  p = (toMax - toMin) / (fromMax - fromMin);
  return ((val - fromMin) * p) + toMin;
}
