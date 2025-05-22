/**
 * 骰子相关功能
 */

// 初始化骰子点数图案
document.addEventListener('DOMContentLoaded', function() {
    initDiceDots();
});

// 初始化骰子点数
function initDiceDots() {
    // 为每个骰子的每个面添加点数
    for (let diceNum = 1; diceNum <= 3; diceNum++) {
        for (let faceNum = 1; faceNum <= 6; faceNum++) {
            const face = document.getElementById(`dice${diceNum}-face${faceNum}`);
            addDots(face, faceNum);
        }
    }
    
    // 初始化双骰组合区域
    initDiceCombos();
    
    // 初始化历史记录中的骰子
    initHistoryDice();
}

// 在骰子面上添加点数
function addDots(face, num) {
    // 清除现有的点
    while (face.firstChild) {
        face.removeChild(face.firstChild);
    }
    
    // 根据点数添加点
    switch (num) {
        case 1:
            addDot(face, 'center');
            break;
        case 2:
            addDot(face, 'top-left');
            addDot(face, 'bottom-right');
            break;
        case 3:
            addDot(face, 'top-left');
            addDot(face, 'center');
            addDot(face, 'bottom-right');
            break;
        case 4:
            addDot(face, 'top-left');
            addDot(face, 'top-right');
            addDot(face, 'bottom-left');
            addDot(face, 'bottom-right');
            break;
        case 5:
            addDot(face, 'top-left');
            addDot(face, 'top-right');
            addDot(face, 'center');
            addDot(face, 'bottom-left');
            addDot(face, 'bottom-right');
            break;
        case 6:
            addDot(face, 'top-left');
            addDot(face, 'top-right');
            addDot(face, 'middle-left');
            addDot(face, 'middle-right');
            addDot(face, 'bottom-left');
            addDot(face, 'bottom-right');
            break;
    }
}

// 添加骰子点
function addDot(face, position) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    
    // 根据位置设置点的位置
    switch (position) {
        case 'center':
            dot.style.top = '50%';
            dot.style.left = '50%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
        case 'top-left':
            dot.style.top = '20%';
            dot.style.left = '20%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
        case 'top-right':
            dot.style.top = '20%';
            dot.style.left = '80%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
        case 'middle-left':
            dot.style.top = '50%';
            dot.style.left = '20%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
        case 'middle-right':
            dot.style.top = '50%';
            dot.style.left = '80%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
        case 'bottom-left':
            dot.style.top = '80%';
            dot.style.left = '20%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
        case 'bottom-right':
            dot.style.top = '80%';
            dot.style.left = '80%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
    }
    
    face.appendChild(dot);
}

// 初始化双骰组合区域
function initDiceCombos() {
    const comboGrid = document.querySelector('.combo-grid');
    if (!comboGrid) return;
    
    // 清空现有内容
    comboGrid.innerHTML = '';
    
    // 创建所有可能的双骰组合
    for (let i = 1; i <= 6; i++) {
        for (let j = i; j <= 6; j++) {
            const comboItem = document.createElement('div');
            comboItem.className = 'combo-item';
            comboItem.dataset.combo = `${i}-${j}`;
            
            const comboDice = document.createElement('div');
            comboDice.className = 'combo-dice';
            
            // 创建两个迷你骰子
            const dice1 = createMiniDice(i);
            const dice2 = createMiniDice(j);
            
            comboDice.appendChild(dice1);
            comboDice.appendChild(dice2);
            comboItem.appendChild(comboDice);
            comboGrid.appendChild(comboItem);
        }
    }
}

// 创建迷你骰子
function createMiniDice(num) {
    const miniDice = document.createElement('div');
    miniDice.className = 'mini-dice';
    
    // 根据点数添加点
    switch (num) {
        case 1:
            addMiniDot(miniDice, 'center');
            break;
        case 2:
            addMiniDot(miniDice, 'top-left');
            addMiniDot(miniDice, 'bottom-right');
            break;
        case 3:
            addMiniDot(miniDice, 'top-left');
            addMiniDot(miniDice, 'center');
            addMiniDot(miniDice, 'bottom-right');
            break;
        case 4:
            addMiniDot(miniDice, 'top-left');
            addMiniDot(miniDice, 'top-right');
            addMiniDot(miniDice, 'bottom-left');
            addMiniDot(miniDice, 'bottom-right');
            break;
        case 5:
            addMiniDot(miniDice, 'top-left');
            addMiniDot(miniDice, 'top-right');
            addMiniDot(miniDice, 'center');
            addMiniDot(miniDice, 'bottom-left');
            addMiniDot(miniDice, 'bottom-right');
            break;
        case 6:
            addMiniDot(miniDice, 'top-left');
            addMiniDot(miniDice, 'top-right');
            addMiniDot(miniDice, 'middle-left');
            addMiniDot(miniDice, 'middle-right');
            addMiniDot(miniDice, 'bottom-left');
            addMiniDot(miniDice, 'bottom-right');
            break;
    }
    
    return miniDice;
}

// 添加迷你骰子点
function addMiniDot(miniDice, position) {
    const dot = document.createElement('div');
    dot.className = 'mini-dot';
    
    // 根据位置设置点的位置
    switch (position) {
        case 'center':
            dot.style.top = '50%';
            dot.style.left = '50%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
        case 'top-left':
            dot.style.top = '20%';
            dot.style.left = '20%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
        case 'top-right':
            dot.style.top = '20%';
            dot.style.left = '80%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
        case 'middle-left':
            dot.style.top = '50%';
            dot.style.left = '20%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
        case 'middle-right':
            dot.style.top = '50%';
            dot.style.left = '80%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
        case 'bottom-left':
            dot.style.top = '80%';
            dot.style.left = '20%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
        case 'bottom-right':
            dot.style.top = '80%';
            dot.style.left = '80%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
    }
    
    miniDice.appendChild(dot);
}

// 初始化历史记录中的骰子
function initHistoryDice() {
    const historyDice = document.querySelectorAll('.history-dice');
    
    historyDice.forEach(dice => {
        const value = parseInt(dice.dataset.value) || 1;
        
        // 清除现有内容
        dice.innerHTML = '';
        
        // 添加点数
        switch (value) {
            case 1:
                addHistoryDot(dice, 'center');
                break;
            case 2:
                addHistoryDot(dice, 'top-left');
                addHistoryDot(dice, 'bottom-right');
                break;
            case 3:
                addHistoryDot(dice, 'top-left');
                addHistoryDot(dice, 'center');
                addHistoryDot(dice, 'bottom-right');
                break;
            case 4:
                addHistoryDot(dice, 'top-left');
                addHistoryDot(dice, 'top-right');
                addHistoryDot(dice, 'bottom-left');
                addHistoryDot(dice, 'bottom-right');
                break;
            case 5:
                addHistoryDot(dice, 'top-left');
                addHistoryDot(dice, 'top-right');
                addHistoryDot(dice, 'center');
                addHistoryDot(dice, 'bottom-left');
                addHistoryDot(dice, 'bottom-right');
                break;
            case 6:
                addHistoryDot(dice, 'top-left');
                addHistoryDot(dice, 'top-right');
                addHistoryDot(dice, 'middle-left');
                addHistoryDot(dice, 'middle-right');
                addHistoryDot(dice, 'bottom-left');
                addHistoryDot(dice, 'bottom-right');
                break;
        }
    });
}

// 添加历史记录骰子点
function addHistoryDot(dice, position) {
    const dot = document.createElement('div');
    dot.className = 'mini-dot';
    
    // 根据位置设置点的位置
    switch (position) {
        case 'center':
            dot.style.top = '50%';
            dot.style.left = '50%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
        case 'top-left':
            dot.style.top = '20%';
            dot.style.left = '20%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
        case 'top-right':
            dot.style.top = '20%';
            dot.style.left = '80%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
        case 'middle-left':
            dot.style.top = '50%';
            dot.style.left = '20%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
        case 'middle-right':
            dot.style.top = '50%';
            dot.style.left = '80%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
        case 'bottom-left':
            dot.style.top = '80%';
            dot.style.left = '20%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
        case 'bottom-right':
            dot.style.top = '80%';
            dot.style.left = '80%';
            dot.style.transform = 'translate(-50%, -50%)';
            break;
    }
    
    dice.appendChild(dot);
}

// 掷骰子动画
function rollDice(callback) {
    const dice1 = document.getElementById('dice1');
    const dice2 = document.getElementById('dice2');
    const dice3 = document.getElementById('dice3');
    const diceCover = document.querySelector('.dice-cover');
    
    // 隐藏骰子盖子
    if (diceCover) {
        diceCover.style.display = 'none';
    }
    
    // 生成随机点数
    const value1 = Math.floor(Math.random() * 6) + 1;
    const value2 = Math.floor(Math.random() * 6) + 1;
    const value3 = Math.floor(Math.random() * 6) + 1;
    
    // 播放骰子声音
    playDiceSound();
    
    // 添加摇晃动画
    dice1.classList.add('shake');
    dice2.classList.add('shake');
    dice3.classList.add('shake');
    
    // 设置随机旋转
    const randomRotation = () => {
        return `rotateX(${Math.floor(Math.random() * 360)}deg) 
                rotateY(${Math.floor(Math.random() * 360)}deg) 
                rotateZ(${Math.floor(Math.random() * 360)}deg)`;
    };
    
    dice1.style.transform = randomRotation();
    dice2.style.transform = randomRotation();
    dice3.style.transform = randomRotation();
    
    // 2秒后停止动画并显示结果
    setTimeout(() => {
        dice1.classList.remove('shake');
        dice2.classList.remove('shake');
        dice3.classList.remove('shake');
        
        // 根据点数设置最终旋转
        dice1.style.transform = getDiceRotation(value1);
        dice2.style.transform = getDiceRotation(value2);
        dice3.style.transform = getDiceRotation(value3);
        
        // 如果有回调函数，则调用
        if (typeof callback === 'function') {
            setTimeout(() => {
                callback([value1, value2, value3]);
            }, 500);
        }
    }, 2000);
    
    return [value1, value2, value3];
}

// 获取骰子旋转角度
function getDiceRotation(value) {
    switch (value) {
        case 1: return 'rotateX(0deg) rotateY(0deg)';
        case 2: return 'rotateX(180deg) rotateY(0deg)';
        case 3: return 'rotateX(0deg) rotateY(90deg)';
        case 4: return 'rotateX(0deg) rotateY(-90deg)';
        case 5: return 'rotateX(90deg) rotateY(0deg)';
        case 6: return 'rotateX(-90deg) rotateY(0deg)';
        default: return 'rotateX(0deg) rotateY(0deg)';
    }
}

// 播放骰子声音
function playDiceSound() {
    const diceSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-dice-rolling-1502.mp3');
    diceSound.play();
}

// 播放赢钱声音
function playWinSound() {
    const winSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
    winSound.play();
}

// 播放输钱声音
function playLoseSound() {
    const loseSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-losing-bleeps-2026.mp3');
    loseSound.play();
}