import random

def roll_dice():
    """模拟投掷三枚骰子，返回点数列表"""
    return [random.randint(1, 6) for _ in range(3)]

def is_triple(dice):
    """判断是否为围骰（三枚骰子数字相同）"""
    return len(set(dice)) == 1

def get_result(dice):
    """根据骰子点数判断大小"""
    total = sum(dice)
    if is_triple(dice):
        return 'lose'  # 围骰直接判负
    elif 11 <= total <= 18:
        return 'win'   # 大
    else:
        return 'lose'  # 小

def martingale_simulation(rounds=100):
    total_wins = 0  # 总赢轮数
    total_losses = 0  # 总输轮数
    total_profit = 0  # 总盈利金额

    for round_num in range(1, rounds + 1):
        bet = 10  # 初始下注金额改为10元
        wins = 0  # 当前轮赢盘数
        losses = 0  # 当前轮输盘数
        profit = 0  # 当前轮盈利金额
        round_result = None  # 当前轮的最终结果（赢或输）

        print(f"\n第{round_num}轮：")
        for attempt in range(5):  # 每轮最多5次投注
            # 投掷骰子并判断结果
            dice = roll_dice()
            result = get_result(dice)

            if result == 'win':
                profit += bet  # 赢钱
                wins += 1
                round_result = 'win'  # 本轮赢
                print(f"  第{attempt + 1}次投注：赢，盈利 +{bet}元")
                break  # 本轮结束
            else:
                profit -= bet  # 输钱
                losses += 1
                print(f"  第{attempt + 1}次投注：输，亏损 -{bet}元")

                # 如果第5次投注也输了，本轮判负
                if attempt == 4:
                    round_result = 'lose'  # 本轮输
                else:
                    bet *= 2  # 加倍下注（10 → 20 → 40 → 80 → 160）

        # 输出当前轮的最终输赢金额
        if round_result == 'win':
            print(f"  本轮结果：赢，盈利 {profit}元")
        else:
            print(f"  本轮结果：输，亏损 {-profit}元")

        # 更新总结果
        if round_result == 'win':
            total_wins += 1
        else:
            total_losses += 1
        total_profit += profit

    # 输出总结果
    print("\n总结果：")
    print(f"总轮数: {rounds} 轮")
    print(f"总赢轮数: {total_wins} 轮")
    print(f"总输轮数: {total_losses} 轮")
    print(f"总盈利金额: {total_profit} 元")

# 运行100轮模拟
martingale_simulation(rounds=100)