/**
 * 游戏主逻辑
 */

// 全局游戏状态
let gameHistory = [];
let lastBets = {};
let totalGames = 0;
let totalWins = 0;
let currentWinStreak = 0;
let maxWinStreak = 0;
let isSoundEnabled = true;

// 初始化游戏
document.addEventListener('DOMContentLoaded', function() {
    // 初始化历史记录分页
    initHistoryPagination();
    
    // 初始化音效控制
    initSoundControl();
});

// 初始化历史记录分页
function initHistoryPagination() {
    const prevPage = document.querySelector('.page-nav:first-child');
    const nextPage = document.querySelector('.page-nav:last-child');
    const pageIndicator = document.querySelector('.page-indicator');
    
    let currentPage = 1;
    const totalPages = 5;
    
    if (prevPage && nextPage && pageIndicator) {
        prevPage.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                updatePageIndicator();
                loadHistoryPage(currentPage);
            }
        });
        
        nextPage.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                updatePageIndicator();
                loadHistoryPage(currentPage);
            }
        });
        
        function updatePageIndicator() {
            pageIndicator.textContent = `${currentPage.toString().padStart(2, '0')}/${totalPages.toString().padStart(2, '0')}`;
        }
    }
}

// 加载历史记录页面
function loadHistoryPage(page) {
    // 每页显示的记录数
    const recordsPerPage = 10;
    
    // 计算起始和结束索引
    const startIndex = (page - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, gameHistory.length);
    
    // 获取当前页的记录
    const pageRecords = gameHistory.slice(startIndex, endIndex);
    
    // 更新历史记录列表
    updateHistoryList(pageRecords);
}

// 更新历史记录列表
function updateHistoryList(records) {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;
    
    // 清空现有内容
    historyList.innerHTML = '';
    
    // 添加记录
    records.forEach(record => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        // 创建结果部分
        const resultDiv = document.createElement('div');
        resultDiv.className = 'history-result';
        
        // 添加骰子
        record.diceValues.forEach(value => {
            const dice = document.createElement('div');
            dice.className = 'history-dice';
            dice.dataset.value = value;
            resultDiv.appendChild(dice);
        });
        
        // 添加总点数
        const totalPoints = document.createElement('span');
        const sum = record.diceValues.reduce((a, b) => a + b, 0);
        totalPoints.textContent = `总点数: ${sum}`;
        resultDiv.appendChild(totalPoints);
        
        // 创建输赢部分
        const winLoseDiv = document.createElement('div');
        if (record.result.totalWin > 0) {
            winLoseDiv.className = 'history-win';
            winLoseDiv.textContent = `+${record.result.totalWin}`;
        } else {
            winLoseDiv.className = 'history-lose';
            winLoseDiv.textContent = record.result.totalWin;
        }
        
        // 添加到历史项
        historyItem.appendChild(resultDiv);
        historyItem.appendChild(winLoseDiv);
        
        // 添加到历史列表
        historyList.appendChild(historyItem);
    });
    
    // 初始化历史记录中的骰子
    initHistoryDice();
}

// 初始化音效控制
function initSoundControl() {
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', function() {
            isSoundEnabled = !isSoundEnabled;
            
            // 更新图标
            if (isSoundEnabled) {
                soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            } else {
                soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            }
        });
    }
}

// 计算结果
function calculateResult(diceValues, bets) {
    const result = {
        totalWin: 0,
        winningBets: [],
        losingBets: []
    };
    
    // 计算总点数
    const sum = diceValues.reduce((a, b) => a + b, 0);
    
    // 检查是否为豹子（三个骰子点数相同）
    const isTriple = diceValues[0] === diceValues[1] && diceValues[1] === diceValues[2];
    
    // 遍历所有投注
    for (const betType in bets) {
        const betAmount = bets[betType].amount;
        let win = 0;
        
        // 根据投注类型计算赢钱
        if (betType === 'big') {
            // 大：总点数为11-17，且不是豹子
            if (sum >= 11 && sum <= 17 && !isTriple) {
                win = betAmount * 1.035;
            }
        } else if (betType === 'small') {
            // 小：总点数为4-10，且不是豹子
            if (sum >= 4 && sum <= 10 && !isTriple) {
                win = betAmount * 1.035;
            }
        } else if (betType.match(/^\d+$/)) {
            // 点数：总点数等于投注的点数
            const betNumber = parseInt(betType);
            if (sum === betNumber) {
                // 根据点数设置赔率
                let odds = 1;
                switch (betNumber) {
                    case 4:
                    case 17:
                        odds = 70.3;
                        break;
                    case 5:
                    case 16:
                        odds = 34.65;
                        break;
                    case 6:
                    case 15:
                        odds = 20.4;
                        break;
                    case 7:
                    case 14:
                        odds = 13.25;
                        break;
                    case 8:
                    case 13:
                        odds = 9.17;
                        break;
                    case 9:
                    case 12:
                        odds = 7.56;
                        break;
                    case 10:
                    case 11:
                        odds = 6.92;
                        break;
                }
                win = betAmount * odds;
            }
        } else if (betType.match(/^\d+-\d+$/)) {
            // 双骰组合：两个骰子点数组合
            const [dice1, dice2] = betType.split('-').map(Number);
            
            // 检查是否有两个骰子匹配组合
            const combinations = [
                [diceValues[0], diceValues[1]],
                [diceValues[0], diceValues[2]],
                [diceValues[1], diceValues[2]]
            ];
            
            for (const combo of combinations) {
                if ((combo[0] === dice1 && combo[1] === dice2) || 
                    (combo[0] === dice2 && combo[1] === dice1)) {
                    win = betAmount * 6.13;
                    break;
                }
            }
        } else if (betType.match(/^dice\d+$/)) {
            // 单骰：特定点数的骰子
            const diceNumber = parseInt(betType.replace('dice', ''));
            
            // 计算特定点数出现的次数
            const count = diceValues.filter(v => v === diceNumber).length;
            
            if (count > 0) {
                // 根据出现次数计算赢钱
                if (count === 1) {
                    win = betAmount * 1; // 单骰
                } else if (count === 2) {
                    win = betAmount * 4; // 双骰
                } else if (count === 3) {
                    win = betAmount * 12; // 三骰
                }
            }
        }
        
        // 更新总赢钱
        result.totalWin += win;
        
        // 记录赢钱或输钱的投注
        if (win > 0) {
            result.winningBets.push({
                type: betType,
                amount: betAmount,
                win: win
            });
        } else {
            result.losingBets.push({
                type: betType,
                amount: betAmount
            });
        }
    }
    
    return result;
}

// 显示结果
function showResult(result, diceValues) {
    // 计算总点数
    const sum = diceValues.reduce((a, b) => a + b, 0);
    
    // 更新统计数据
    totalGames++;
    
    if (result.totalWin > 0) {
        // 赢钱
        totalWins++;
        currentWinStreak++;
        maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
        
        // 播放赢钱声音
        if (isSoundEnabled) {
            playWinSound();
        }
        
        // 显示赢钱动画
        const diceArea = document.querySelector('.dice-area');
        if (diceArea) {
            diceArea.classList.add('win-animation');
            setTimeout(() => {
                diceArea.classList.remove('win-animation');
            }, 3000);
        }
        
        // 显示赢钱消息
        alert(`恭喜！您赢了 ${result.totalWin.toFixed(2)} 元！`);
    } else {
        // 输钱
        currentWinStreak = 0;
        
        // 播放输钱声音
        if (isSoundEnabled) {
            playLoseSound();
        }
        
        // 显示输钱动画
        const diceArea = document.querySelector('.dice-area');
        if (diceArea) {
            diceArea.classList.add('lose-animation');
            setTimeout(() => {
                diceArea.classList.remove('lose-animation');
            }, 3000);
        }
        
        // 显示输钱消息
        const totalBet = document.getElementById('total-bet').textContent;
        alert(`很遗憾，您输了 ${totalBet} 元！`);
    }
    
    // 更新统计显示
    updateStats();
}

// 更新统计数据
function updateStats() {
    document.getElementById('total-games').textContent = totalGames;
    document.getElementById('win-rate').textContent = totalGames > 0 ? `${Math.round((totalWins / totalGames) * 100)}%` : '0%';
    document.getElementById('win-streak').textContent = currentWinStreak;
    document.getElementById('max-win-streak').textContent = maxWinStreak;
}

// 添加到历史记录
function addToHistory(diceValues, result) {
    // 创建新的历史记录
    const historyRecord = {
        diceValues: diceValues,
        result: result,
        timestamp: new Date().getTime()
    };
    
    // 添加到历史记录数组
    gameHistory.unshift(historyRecord);
    
    // 限制历史记录数量
    if (gameHistory.length > 50) {
        gameHistory.pop();
    }
    
    // 更新历史记录显示
    loadHistoryPage(1);
    
    // 保存最后一次投注
    lastBets = JSON.parse(JSON.stringify(currentBets));
}

// 保存游戏状态
function saveGameState() {
    const gameState = {
        balance: balance,
        gameHistory: gameHistory,
        totalGames: totalGames,
        totalWins: totalWins,
        currentWinStreak: currentWinStreak,
        maxWinStreak: maxWinStreak
    };
    
    localStorage.setItem('sicBoGameState', JSON.stringify(gameState));
}

// 加载游戏状态
function loadGameState() {
    const savedState = localStorage.getItem('sicBoGameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        
        balance = gameState.balance;
        gameHistory = gameState.gameHistory;
        totalGames = gameState.totalGames;
        totalWins = gameState.totalWins;
        currentWinStreak = gameState.currentWinStreak;
        maxWinStreak = gameState.maxWinStreak;
        
        // 更新显示
        updateBalance();
        updateStats();
        loadHistoryPage(1);
    }
}