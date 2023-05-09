import parseRedditJson from '../parse/parsing.mjs';
import * as testData from './testData.mjs';
import monitorPost from '../parse/monitorParse.mjs';

const testArr = parseRedditJson(testData.json);

test('Parses prices', () => {
  for (let i = 0; i < testArr.length; i++) {
    expect(testArr[i].price).toBe(testData.answers.price[i]);
  }
});

// test('Parses brands', () => {
//   for (let i = 0; i < testArr.length; i++) {
//     expect(testArr[i].brand).toBe(testData.answers.brand[i]);
//   }
// });

// test('Parses monitor details', () => {
//   for (let i = 1; i < 2; i++) {
//     expect(monitorPost(testArr[i].reddit.title)).toBe(testData.answers.price[i]);
//   }
// });
