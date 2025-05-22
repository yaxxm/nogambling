/**
 * 下注相关功能
 */

// 全局变量
let selectedChip = null;
let currentBets = {}; // 存储当前下注，格式：{betType: {amount: 总金额, chips: [{value: 筹码值, element: DOM元素}]}}
let balance = 1000000; // 初始余额
let draggedChip = null; // 当前拖动的筹码

// 投注策略配置
let bettingStrategy = {
    enabled: false, // 是否启用自动投注
    totalRounds: 10, // 总轮数
    currentRound: 0, // 当前轮数
    betType: 'big', // 投注类型：big(大)、small(小)、specific(具体点数)
    betValue: 1000, // 初始投注金额
    strategy: 'fixed', // 投注策略：fixed(固定)、martingale(倍投)
    maxBet: 50000, // 最大投注金额
    stopWin: 100000, // 止盈金额
    stopLoss: -50000, // 止损金额
    initialBalance: 1000000, // 初始余额，用于计算盈亏
    winCount: 0, // 获胜次数
    loseCount: 0, // 失败次数
    currentProfit: 0 // 当前盈亏
};

// 初始化下注功能
document.addEventListener('DOMContentLoaded', function() {
    initChips();
    initBettingAreas();
    initStrategyControls();
    updateBalance();
});

// 初始化策略控制
function initStrategyControls() {
    // 添加策略控制面板
    const controlPanel = document.createElement('div');
    controlPanel.className = 'strategy-controls';
    controlPanel.innerHTML = `
        <h3>自动投注策略</h3>
        <div class="control-group">
            <label>启用自动投注：<input type="checkbox" id="strategy-enabled"></label>
        </div>
        <div class="control-group">
            <label>投注类型：
                <select id="bet-type">
                    <option value="big">大</option>
                    <option value="small">小</option>
                    <option value="specific">指定点数</option>
                </select>
            </label>
        </div>
        <div class="control-group">
            <label>投注策略：
                <select id="strategy-type">
                    <option value="fixed">固定投注</option>
                    <option value="martingale">倍投</option>
                </select>
            </label>
        </div>
        <div class="control-group">
            <label>初始投注金额：<input type="number" id="initial-bet" value="1000"></label>
        </div>
        <div class="control-group">
            <label>总轮数：<input type="number" id="total-rounds" value="10"></label>
        </div>
        <div class="control-group">
            <label>最大投注金额：<input type="number" id="max-bet" value="50000"></label>
        </div>
        <div class="control-group">
            <label>止盈金额：<input type="number" id="stop-win" value="100000"></label>
        </div>
        <div class="control-group">
            <label>止损金额：<input type="number" id="stop-loss" value="-50000"></label>
        </div>
        <div class="strategy-stats">
            <p>当前轮数：<span id="current-round">0</span> / <span id="total-rounds-display">10</span></p>
            <p>当前盈亏：<span id="current-profit">0</span></p>
            <p>胜/负：<span id="win-count">0</span> / <span id="lose-count">0</span></p>
        </div>
    `;

    document.querySelector('.betting-controls').appendChild(controlPanel);

    // 绑定控制面板事件
    document.getElementById('strategy-enabled').addEventListener('change', function(e) {
        bettingStrategy.enabled = e.target.checked;
        if (e.target.checked) {
            startAutobet();
        }
    });

    document.getElementById('bet-type').addEventListener('change', function(e) {
        bettingStrategy.betType = e.target.value;
    });

    document.getElementById('strategy-type').addEventListener('change', function(e) {
        bettingStrategy.strategy = e.target.value;
    });

    document.getElementById('initial-bet').addEventListener('change', function(e) {
        bettingStrategy.betValue = parseInt(e.target.value);
    });

    document.getElementById('total-rounds').addEventListener('change', function(e) {
        bettingStrategy.totalRounds = parseInt(e.target.value);
        document.getElementById('total-rounds-display').textContent = e.target.value;
    });

    document.getElementById('max-bet').addEventListener('change', function(e) {
        bettingStrategy.maxBet = parseInt(e.target.value);
    });

    document.getElementById('stop-win').addEventListener('change', function(e) {
        bettingStrategy.stopWin = parseInt(e.target.value);
    });

    document.getElementById('stop-loss').addEventListener('change', function(e) {
        bettingStrategy.stopLoss = parseInt(e.target.value);
    });
}

// 开始自动投注
function startAutobet() {
    if (!bettingStrategy.enabled) return;
    
    // 重置统计数据
    bettingStrategy.currentRound = 0;
    bettingStrategy.winCount = 0;
    bettingStrategy.loseCount = 0;
    bettingStrategy.currentProfit = 0;
    bettingStrategy.initialBalance = balance;

    // 执行首次投注
    executeAutobet();
}

// 执行自动投注
function executeAutobet() {
    if (!bettingStrategy.enabled) return;

    // 检查是否达到轮数限制
    if (bettingStrategy.currentRound >= bettingStrategy.totalRounds) {
        bettingStrategy.enabled = false;
        document.getElementById('strategy-enabled').checked = false;
        alert('已完成设定轮数！');
        return;
    }

    // 检查止盈止损
    if (bettingStrategy.currentProfit >= bettingStrategy.stopWin) {
        bettingStrategy.enabled = false;
        document.getElementById('strategy-enabled').checked = false;
        alert('已达到止盈金额！');
        return;
    }

    if (bettingStrategy.currentProfit <= bettingStrategy.stopLoss) {
        bettingStrategy.enabled = false;
        document.getElementById('strategy-enabled').checked = false;
        alert('已达到止损金额！');
        return;
    }

    // 计算本次投注金额
    let betAmount = bettingStrategy.betValue;
    if (bettingStrategy.strategy === 'martingale' && bettingStrategy.currentRound > 0) {
        betAmount = bettingStrategy.betValue * Math.pow(2, bettingStrategy.loseCount);
        if (betAmount > bettingStrategy.maxBet) {
            betAmount = bettingStrategy.maxBet;
        }
    }

    // 检查余额是否足够
    if (balance < betAmount) {
        bettingStrategy.enabled = false;
        document.getElementById('strategy-enabled').checked = false;
        alert('余额不足！');
        return;
    }

    // 执行投注
    const betArea = document.querySelector(`[data-bet="${bettingStrategy.betType}"]`);
    if (betArea) {
        placeBet(betArea, betAmount);
        confirmBet();
    }
}

// 更新策略统计信息
function updateStrategyStats(isWin, profit) {
    if (!bettingStrategy.enabled) return;

    bettingStrategy.currentRound++;
    if (isWin) {
        bettingStrategy.winCount++;
        if (bettingStrategy.strategy === 'martingale') {
            bettingStrategy.loseCount = 0;
        }
    } else {
        bettingStrategy.loseCount++;
    }

    bettingStrategy.currentProfit += profit;

    // 更新显示
    document.getElementById('current-round').textContent = bettingStrategy.currentRound;
    document.getElementById('current-profit').textContent = bettingStrategy.currentProfit;
    document.getElementById('win-count').textContent = bettingStrategy.winCount;
    document.getElementById('lose-count').textContent = bettingStrategy.loseCount;

    // 继续下一轮投注
    setTimeout(executeAutobet, 2000);
}

// 初始化筹码
function initChips() {
    const chips = document.querySelectorAll('.chip');
    
    chips.forEach(chip => {
        chip.addEventListener('dragstart', function(e) {
            const chipValue = parseInt(this.dataset.value);
            if (balance < chipValue) {
                e.preventDefault(); // 阻止拖动
                alert('余额不足！');
                return;
            }

            // 设置拖动数据，这里只传递筹码值
            e.dataTransfer.setData('text/plain', chipValue);
            e.dataTransfer.effectAllowed = 'move';
            draggedChip = this;

            // 设置拖动时的图像
            const dragImage = this.cloneNode(true);
            dragImage.style.position = 'absolute';
            dragImage.style.top = '-1000px';
            document.body.appendChild(dragImage);
            e.dataTransfer.setDragImage(dragImage, this.offsetWidth / 2, this.offsetHeight / 2);

            // 在拖动结束后移除克隆的图像
            setTimeout(() => {
                dragImage.remove();
            }, 0);
        });

        chip.addEventListener('dragend', function(e) {
            // 重置选中的筹码和拖动状态
            selectedChip = null;
            draggedChip = null;
        });
    });
}

// 更新拖动中筹码的位置
function updateDraggingChipPosition(e) {
    const draggingChip = document.getElementById('dragging-chip');
    // 获取筹码的尺寸，确保鼠标在筹码中心
    const chipWidth = draggingChip.offsetWidth || 50;
    const chipHeight = draggingChip.offsetHeight || 50;
    
    // 计算偏移量，使鼠标位于筹码中心
    const offsetX = chipWidth / 2;
    const offsetY = chipHeight / 2;
    
    // 设置筹码位置，确保鼠标在筹码中心
    draggingChip.style.left = `${e.clientX - offsetX}px`;
    draggingChip.style.top = `${e.clientY - offsetY}px`;
}

// 查找投注区域
function findBetArea(element) {
    // 检查元素本身是否是投注区域
    if (element.classList && (element.classList.contains('bet-option') || element.classList.contains('combo-item'))) {
        return element;
    }
    
    // 检查父元素
    let parent = element.parentElement;
    while (parent) {
        if (parent.classList && (parent.classList.contains('bet-option') || parent.classList.contains('combo-item'))) {
            return parent;
        }
        parent = parent.parentElement;
    }
    
    // 如果没有找到直接的元素，尝试通过位置查找
    return findBetAreaByPosition();
}

// 通过鼠标位置查找投注区域
function findBetAreaByPosition() {
    // 获取鼠标当前位置
    const draggingChip = document.getElementById('dragging-chip');
    if (!draggingChip) return null;
    
    const chipRect = draggingChip.getBoundingClientRect();
    const chipX = chipRect.left + chipRect.width / 2;
    const chipY = chipRect.top + chipRect.height / 2;
    
    // 检查所有可能的投注区域
    const allBetAreas = [
        ...document.querySelectorAll('.bet-option'),
        ...document.querySelectorAll('.combo-item')
    ];
    
    // 找到鼠标位置下方的投注区域
    for (const area of allBetAreas) {
        const rect = area.getBoundingClientRect();
        // 增加一点容错范围，使拖放更容易
        const tolerance = 5; // 5像素的容错
        if (chipX >= rect.left - tolerance && chipX <= rect.right + tolerance && 
            chipY >= rect.top - tolerance && chipY <= rect.bottom + tolerance) {
            return area;
        }
    }
    
    return null;
}

// 初始化投注区域
function initBettingAreas() {
    // 大小投注区域
    const bigSmallOptions = document.querySelectorAll('.big-small-area .bet-option');
    bigSmallOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (selectedChip) {
                placeBet(this, selectedChip.value);
                selectedChip = null;
            }
        });
    });
    
    // 点数投注区域
    const numberOptions = document.querySelectorAll('.number-row .bet-option');
    numberOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (selectedChip) {
                placeBet(this, selectedChip.value);
                selectedChip = null;
            }
        });
    });
    
    // 双骰组合区域
    const comboItems = document.querySelectorAll('.combo-item');
    comboItems.forEach(item => {
        item.addEventListener('click', function() {
            if (selectedChip) {
                placeBet(this, selectedChip.value);
                selectedChip = null;
            }
        });
    });
    
    // 单骰、双骰、三骰区域
    const specificOptions = document.querySelectorAll('.specific-row .bet-option');
    specificOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (selectedChip) {
                placeBet(this, selectedChip.value);
                selectedChip = null;
            }
        });
    });

    // 获取所有投注区域
    const allBetAreas = [
        ...document.querySelectorAll('.betting-area .bet-option'),
        ...document.querySelectorAll('.combo-item')
    ];

    // 为所有投注区域添加拖放事件监听器
    allBetAreas.forEach(area => {
        area.addEventListener('dragover', function(e) {
            e.preventDefault(); // 阻止默认行为，允许放置
            e.dataTransfer.dropEffect = 'move';
        });

        area.addEventListener('drop', function(e) {
            e.preventDefault(); // 阻止默认行为
            const chipValue = parseInt(e.dataTransfer.getData('text/plain'));
            if (!isNaN(chipValue)) {
                placeBet(this, chipValue);
            }
        });
    });

    // 清除单一押注按钮
    document.getElementById('clear-bet').addEventListener('click', function() {
        clearSelectedBet();
    });

    // 清除全部押注按钮
    document.getElementById('clear-all').addEventListener('click', function() {
        clearAllBets();
    });
    
    // 重复押注按钮
    document.getElementById('repeat-bet').addEventListener('click', function() {
        repeatLastBet();
    });
    
    // 确认押注按钮
    document.getElementById('confirm-bet').addEventListener('click', function() {
        confirmBet();
    });
}

// 放置筹码
function placeBet(betArea, chipValue) {
    // 获取投注类型
    const betType = betArea.dataset.bet || betArea.dataset.combo;
    
    // 检查余额是否足够
    if (balance < chipValue) {
        alert('余额不足！');
        return;
    }
    
    // 更新余额
    balance -= chipValue;
    updateBalance();
    
    // 更新当前投注记录
    if (!currentBets[betType]) {
        currentBets[betType] = {
            amount: 0,
            chips: []
        };
    }
    
    currentBets[betType].amount += chipValue;
    
    // 创建筹码元素
    const placedChip = document.createElement('div');
    placedChip.className = 'placed-chip';
    placedChip.textContent = formatChipValue(chipValue);
    placedChip.dataset.value = chipValue;
    
    // 设置筹码样式
    setChipStyle(placedChip, chipValue);
    
    // 获取投注区域的位置和尺寸
    const rect = betArea.getBoundingClientRect();
    
    // 计算投注区域的中心，并添加少量随机偏移以避免筹码完全重叠
    const centerX = Math.floor(rect.width / 2) - 15 + (Math.random() * 20 - 10);
    const centerY = Math.floor(rect.height / 2) - 15 + (Math.random() * 20 - 10);
    
    // 确保筹码不会超出投注区域边界
    const safeX = Math.max(10, Math.min(rect.width - 30, centerX));
    const safeY = Math.max(10, Math.min(rect.height - 30, centerY));
    
    // 设置定位方式为绝对定位，确保筹码相对于投注区域定位
    placedChip.style.position = 'absolute';
    placedChip.style.left = `${safeX}px`;
    placedChip.style.top = `${safeY}px`;
    
    // 确保投注区域有相对定位，这样筹码才能正确定位
    const currentPosition = window.getComputedStyle(betArea).position;
    if (currentPosition === 'static') {
        betArea.style.position = 'relative';
    }
    
    // 将筹码添加到投注区域
    betArea.appendChild(placedChip);
    
    // 保存筹码元素
    currentBets[betType].chips.push({
        value: chipValue,
        element: placedChip
    });
    
    // 更新总投注金额
    updateTotalBet();
    
    // 播放下注声音
    playChipSound();
}

// 设置筹码样式
function setChipStyle(chipElement, value) {
    switch (value) {
        case 1000:
            chipElement.style.background = 'linear-gradient(135deg, #fff, #ddd)';
            chipElement.style.color = '#333';
            chipElement.style.border = '2px dashed #333';
            break;
        case 5000:
            chipElement.style.background = 'linear-gradient(135deg, #ff9999, #ff5555)';
            chipElement.style.color = 'white';
            chipElement.style.border = '2px dashed #fff';
            break;
        case 10000:
            chipElement.style.background = 'linear-gradient(135deg, #99ccff, #3399ff)';
            chipElement.style.color = 'white';
            chipElement.style.border = '2px dashed #fff';
            break;
        case 20000:
            chipElement.style.background = 'linear-gradient(135deg, #99ff99, #33cc33)';
            chipElement.style.color = 'white';
            chipElement.style.border = '2px dashed #fff';
            break;
        case 50000:
            chipElement.style.background = 'linear-gradient(135deg, #cc99ff, #9933ff)';
            chipElement.style.color = 'white';
            chipElement.style.border = '2px dashed #fff';
            break;
    }
}

// 格式化筹码值显示
function formatChipValue(value) {
    if (value >= 1000) {
        return `${value / 1000}K`;
    }
    return value.toString();
}

// 更新余额显示
function updateBalance() {
    document.getElementById('balance').textContent = balance.toFixed(2);
}

// 更新总投注金额
function updateTotalBet() {
    let totalBet = 0;
    for (const betType in currentBets) {
        totalBet += currentBets[betType].amount;
    }
    
    document.querySelector('.current-bet').textContent = `本局总押注: ${totalBet}`;
    document.getElementById('total-bet').textContent = totalBet;
}

// 清除选中的投注
function clearSelectedBet() {
    // 待实现：清除用户点击的特定投注
    alert('请点击要清除的投注区域');
    
    // 设置点击监听器来清除特定投注
    const clearListener = function(e) {
        const betArea = findBetArea(e.target);
        if (betArea) {
            const betType = betArea.dataset.bet || betArea.dataset.combo;
            if (currentBets[betType]) {
                // 返还投注金额
                balance += currentBets[betType].amount;
                updateBalance();
                
                // 移除筹码元素
                currentBets[betType].chips.forEach(chip => {
                    chip.element.remove();
                });
                
                // 删除投注记录
                delete currentBets[betType];
                
                // 更新总投注金额
                updateTotalBet();
                
                // 播放清除声音
                playClearSound();
            }
        }
        
        // 移除监听器
        document.removeEventListener('click', clearListener);
    };
    
    // 添加一次性点击监听器
    document.addEventListener('click', clearListener);
}

// 清除所有投注
function clearAllBets() {
    // 返还所有投注金额
    for (const betType in currentBets) {
        balance += currentBets[betType].amount;
        
        // 移除筹码元素
        currentBets[betType].chips.forEach(chip => {
            chip.element.remove();
        });
    }
    
    // 重置投注记录
    currentBets = {};
    
    // 更新余额和总投注金额
    updateBalance();
    updateTotalBet();
    
    // 播放清除声音
    playClearSound();
}

// 重复上一次投注
function repeatLastBet() {
    // 待实现：记录上一次投注并重复
    alert('重复上一次投注功能尚未实现');
}

// 确认投注
function confirmBet() {
    // 检查是否有投注
    if (Object.keys(currentBets).length === 0) {
        alert('请先下注！');
        return;
    }
    
    // 开始掷骰子
    rollDice(function(diceValues) {
        // 计算结果
        const result = calculateResult(diceValues, currentBets);
        
        // 更新余额
        balance += result.totalWin;
        updateBalance();
        
        // 显示结果
        showResult(result, diceValues);
        
        // 添加到历史记录
        addToHistory(diceValues, result);
        
        // 处理自动投注结果
        if (bettingStrategy.enabled) {
            const isWin = result.totalWin > 0;
            const profit = result.totalWin - Object.values(currentBets).reduce((total, bet) => total + bet.amount, 0);
            updateStrategyStats(isWin, profit);
        }
        
        // 清除当前投注
        clearCurrentBets();
    });
}

// 清除当前投注（不返还金额）
function clearCurrentBets() {
    // 移除筹码元素
    for (const betType in currentBets) {
        currentBets[betType].chips.forEach(chip => {
            chip.element.remove();
        });
    }
    
    // 重置投注记录
    currentBets = {};
    
    // 更新总投注金额
    updateTotalBet();
}

// 播放筹码声音
function playChipSound() {
    const chipSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-poker-chips-handling-1995.mp3');
    chipSound.volume = 0.5;
    chipSound.play();
}

// 播放清除声音
function playClearSound() {
    const clearSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-game-click-1114.mp3');
    clearSound.play();
}