const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// MIME类型映射
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  console.log(`请求: ${req.url}`);
  
  // 处理URL，默认为index.html
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);
  
  // 获取文件扩展名
  const extname = path.extname(filePath).toLowerCase();
  
  // 设置默认的内容类型
  let contentType = mimeTypes[extname] || 'application/octet-stream';
  
  // 读取文件
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 文件不存在
        console.error(`文件不存在: ${filePath}`);
        res.writeHead(404);
        res.end('404 - 文件不存在');
      } else {
        // 服务器错误
        console.error(`服务器错误: ${err.code}`);
        res.writeHead(500);
        res.end(`服务器错误: ${err.code}`);
      }
    } else {
      // 成功响应
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`请在浏览器中访问上面的地址来查看骰宝游戏界面`);
});