import parseRedditJson from '../parse/parsing.js';
import * as testData from './testData.js';
import monitorPost from '../parse/monitorParse.js';

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
