import * as data from './monitorTitles.mjs';
import parseMonitorDetails from '../../parse/monitorParse.mjs';

test('Parses monitor details', () => {
  for (let i = 0; i < 12; i++) {
    expect(parseMonitorDetails(data.titles[i])).toStrictEqual(data.answers[i]);
  }
});
