import render, { parse, toHTML } from './index.js';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 테스트 문서
const testDoc = `
'''[[링크 테스트]]'''
'''[[https://daol.cc|외부링크 테스트]]'''
'''[[아마도|''이런거'']]'''
[[링크|'''이런거''']]
[[링크|''저런거'']]
''[[링크|'''이런거''']]''
`;

console.log('=== 나무마크 파서 테스트 ===\n');

console.log('원본:');
console.log(testDoc);

console.log('\n토큰:');
const tokens = parse(testDoc);
console.log(JSON.stringify(tokens, null, 2));

console.log('\nHTML:');
const html = render(testDoc);
console.log(html);

console.log('\n=== 테스트 완료 ===');

const htmlTemplate = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>나무마크 파서 테스트 결과</title>
    <style>
        body {
            font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            line-height: 1.6;
        }
        h1 {
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .section {
            margin: 30px 0;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 8px;
        }
        .section h2 {
            margin-top: 0;
            color: #2c3e50;
        }
        pre {
            background: #fff;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            border: 1px solid #ddd;
        }
        .result {
            background: #fff;
            padding: 20px;
            border-radius: 5px;
            border: 1px solid #ddd;
        }
        .wiki-link {
            color: #0066cc;
            text-decoration: none;
        }
        .wiki-external-link {
            color: #090;
            text-decoration: none;
        }
        .wiki-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <h1>나무마크 파서 테스트 결과</h1>
    
    <div class="section">
        <h2>1. 원본 텍스트</h2>
        <pre>${testDoc.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
    </div>
    
    <div class="section">
        <h2>2. 파싱 토큰</h2>
        <pre>${JSON.stringify(tokens, null, 2).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
    </div>
    
    <div class="section">
        <h2>3. HTML 렌더링 결과</h2>
        <div class="result">
            ${html}
        </div>
    </div>
</body>
</html>`;

const outputPath = join(__dirname, 'test.html');
writeFileSync(outputPath, htmlTemplate);
console.log(`\n✅ HTML 파일 생성 완료: ${outputPath}`);
