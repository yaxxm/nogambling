#!/usr/bin/env python3

import http.server
import socketserver
import os

# 设置端口
PORT = 8000

# 获取当前目录作为服务器根目录
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    # 设置根目录
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    # 设置响应头
    def end_headers(self):
        # 添加CORS头，允许跨域请求
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

# 创建HTTP服务器
with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"服务器运行在 http://localhost:{PORT}")
    print(f"请在浏览器中访问上面的地址来查看骰宝游戏界面")
    # 启动服务器
    httpd.serve_forever()