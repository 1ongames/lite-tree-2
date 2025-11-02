import render, { parse, toHTML } from './index.js';

// 테스트 문서
const testDoc = `
안녕하세요! 이것은 테스트 문서입니다.

[[FrontPage]]를 방문해보세요.
[[문서|표시 텍스트]]도 가능합니다.

일반 텍스트와 [[링크]]가 섞여 있습니다.
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
