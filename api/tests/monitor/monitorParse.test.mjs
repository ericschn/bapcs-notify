import * as data from './monitorTitles.js';
import parseMonitorDetails from '../../parse/monitorParse.js';

test('Parses monitor details', () => {
  for (let i = 0; i < 11; i++) {
    expect(parseMonitorDetails(data.titles[i])).toStrictEqual(data.answers[i]);
  }
});
