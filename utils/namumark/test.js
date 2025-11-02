import render, { parse, toHTML } from './index.js';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 테스트 문서
const testDoc = `
안녕하세요! 이것은 '''테스트''' 문서입니다.

[[FrontPage]]를 방문해보세요.
[[문서|표시 텍스트]]도 가능합니다.[br][br]그리고 제 대가리는 점점 터져갑니다

일반 텍스트와 [[링크]]가 섞여 있습니다.

[[https://hanbit.cc/]]와 같은 [[https://daol.cc|외부 링크]]도 지원합니다.

''[[이런것]]도 [[ㅁㄴㅇㄹ|처리]]가 잘 되나?''
'''[[이것]]도 [[ㅁㄴㅇㄹ|처리]]가 잘 되나?'''

__이런건__ [plum] 처리되는듯

''기울임''과 '''굵음''', 그리고 '''''혼합'''''까지 테스트합니다.

'''굵은 글씨 안에 ''기울임''이 있어요'''

''기울임 안에 '''굵음'''도 가능해요''

'''바깥 굵음 ''중간 기울임'' 다시 굵음'''
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
