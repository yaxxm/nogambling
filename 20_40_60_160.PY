import random

"""
骰子游戏模拟 - 马丁格尔策略

参数说明：
- money: 投注金额的列表，表示每轮的下注金额序列（例如 [20, 40, 80, 160]）。
- num: 投注的轮数，表示模拟的总轮数。
- initial_capital: 初始本金，当本金不足以进行下一次下注时，游戏结束。

功能说明：
1. 模拟投掷三枚骰子，判断每轮的结果（赢、输或围骰）。
2. 使用马丁格尔策略：每次输掉后加倍下注，直到赢或达到投注次数上限。
3. 当本金不足以进行下一次下注时，游戏结束，并输出结束的轮数。
4. 记录并输出最大盈利金额。
5. 统计总赢轮数、总输轮数和总盈利金额。
"""

# 输入参数
money = [20, 40, 80, 160,320,640,1280,2560,5120]  # 每轮的下注金额序列
num = 100  # 模拟的总轮数
initial_capital_ori=initial_capital = 2000  # 初始本金

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

def martingale_simulation(money, rounds, initial_capital):
    """
    马丁格尔策略模拟

    参数：
    - money: 每轮的下注金额序列。
    - rounds: 模拟的总轮数。
    - initial_capital: 初始本金。

    输出：
    - 每轮的投注结果和总统计结果。
    - 如果本金不足，输出结束的轮数。
    - 输出最大盈利金额。
    """
    total_wins = 0  # 总赢轮数
    total_losses = 0  # 总输轮数
    total_profit = 0  # 总盈利金额
    capital = initial_capital  # 当前本金
    max_money = 0  # 最大盈利金额，初始值为本金

    for round_num in range(1, rounds + 1):
        wins = 0  # 当前轮赢盘数
        losses = 0  # 当前轮输盘数
        profit = 0  # 当前轮盈利金额
        round_result = None  # 当前轮的最终结果（赢或输）

        print(f"\n第{round_num}轮：")
        for attempt, bet in enumerate(money):  # 每轮按 money 列表中的金额下注
            # 检查本金是否足够下注
            if capital < bet:
                print("**********输了****************")
                print(f"  本金不足，无法进行第{attempt + 1}次投注。游戏结束。")
                print(f"  结束轮数: {round_num - 1} 轮")
                print(f"  最大盈利金额: {max_money} 元")
                return  # 结束模拟

            # 投掷骰子并判断结果
            dice = roll_dice()
            result = get_result(dice)

            if result == 'win':
                profit += bet  # 赢钱
                capital += bet  # 更新本金
                wins += 1
                round_result = 'win'  # 本轮赢
                print(f"  第{attempt + 1}次投注：赢，盈利 +{bet}元")
                break  # 本轮结束
            else:
                profit -= bet  # 输钱
                capital -= bet  # 更新本金
                losses += 1
                print(f"  第{attempt + 1}次投注：输，亏损 -{bet}元")

                # 如果最后一次投注也输了，本轮判负
                if attempt == len(money) - 1:
                    round_result = 'lose'  # 本轮输

        # 更新最大盈利金额
        if capital > max_money:
            max_money = capital

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
    if capital > initial_capital_ori:
        print("**********赢了****************")
    else:
        print("**********输了****************")
    print(f"总轮数: {rounds} 轮")
    print(f"总赢轮数: {total_wins} 轮")
    print(f"总输轮数: {total_losses} 轮")
    print(f"总盈利金额: {total_profit} 元")
    print(f"最终本金: {capital} 元")
    print(f"最大盈利金额: {max_money} 元")

# 运行模拟
martingale_simulation(money, num, initial_capital)