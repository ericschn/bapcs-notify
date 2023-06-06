// Regex
// TODO: HDR triggers HD in regex
const monitorResolutions = [
  [/u(ltra)?\s?wqhd/i, 3440, 1440],
  [/w?qhd/i, 2560, 1440],
  [/(f(ull)?)?[\s_-]?hd/i, 1920, 1080],
  [/u(ltra[\s_-]?)?hd/i, 3840, 2160],
  [/4k/i, 3840, 2160],
];
const resolutionReg = /\d{4}\s?x?\s?\d{4}/i;
const resolutionRegP = /\d{4}\s?p/i;
const diagSizeReg = /(\d\d[\.,]?\d?)[\s_-]?(?:'|"|”|in)/i;
const diagSizeReg2 = /\s\d\d([\.,]\d)?\s[^h][^z]/i;
const hzReg = /\d\d+\s?hz/i;
const gsyncReg = /g\s?-?sync/i;
const freesyncReg = /free\s?-?sync/i;

export default function parseMonitorDetails(title) {
  let monitorItem = {
    inches: null,
    hz: null,
    hRes: null,
    vRes: null,
    panel: null,
    sync: null,
    ultrawide: null,
    curved: null,
  };
  let hRes = 0;
  let vRes = 0;

  // Look through title for information

  // Resolution
  let resolutionMatch = title.match(resolutionReg);
  let resolutionMatchP = title.match(resolutionRegP);
  if (resolutionMatch) {
    let resolutionFull = resolutionMatch[0].replace(/\s/g, '').toLowerCase();
    // split horiz and vert resolution
    hRes = resolutionFull.split('x')[0];
    vRes = resolutionFull.split('x')[1];
    monitorItem.hRes = parseInt(hRes);
    monitorItem.vRes = parseInt(vRes);
  } else {
    if (resolutionMatchP) {
      // check for p type
      vRes = resolutionMatchP[0].replace(/\D/g, '');
      monitorItem.vRes = parseInt(vRes);
    } else {
      // FHD etc matching
      for (let r of monitorResolutions) {
        if (title.match(r[0])) {
          monitorItem.hRes = r[1];
          monitorItem.vRes = r[2];
          break;
        }
      }
    }
  }

  // Diagonal Size
  let diagSizeMatch = title.match(diagSizeReg);
  let diagSizeMatch2 = title.match(diagSizeReg2);
  if (diagSizeMatch) {
    let diagSize = diagSizeMatch[0].replace(/[^0-9\.,]/g, '');
    monitorItem.inches = parseFloat(diagSize);
  } else if (diagSizeMatch2) {
    let diagSize = diagSizeMatch2[0].replace(/[^0-9\.,]/g, '');
    monitorItem.inches = parseFloat(diagSize);
  }

  // Hz
  let hzMatch = title.match(hzReg);
  if (hzMatch) {
    monitorItem.hz = parseInt(hzMatch[0].replace(/\D/g, ''));
    // console.log("Hz: " + hzMatch[0].replace(/hz/gi, '').trim());
  }

  // Panel Type
  // TODO: VA panel
  if (title.match(/\Wips\W/i)) {
    monitorItem.panel = 'ips';
  } else if (title.match(/\Woled\W/i)) {
    monitorItem.panel = 'oled';
  } else if (title.match(/\Wva\W/i)) {
    monitorItem.panel = 'va';
  }

  // Gsync/Freesync
  let gsyncMatch = title.match(gsyncReg);
  let freesyncMatch = title.match(freesyncReg);
  if (gsyncMatch) {
    monitorItem.sync = 'gSync';
  }
  if (freesyncMatch) {
    monitorItem.sync = 'FreeSync';
  }

  // Brand
  // TODO: brands file
  const monitorBrands = [
    'Dell',
    'Alienware',
    'LG',
    'Ultragear',
    'Samsung',
    'Acer',
    'ASUS',
    'KOORUI',
    'MSI',
    'INNOCN',
    'Corsair',
    'Monoprice',
    'Gigabyte',
    'Razer',
    'BenQ',
    'Vizio',
    'Lenovo',
    'HP',
    'Sceptre',
    'Viewsonic',
    'ASRock',
    'Sony',
  ];

  // TODO: if brand not found in title, look in url
  const monitorWebsites = ['samsung', 'lg', 'dell', 'acer', 'asus'];
  for (let brand of monitorBrands) {
    let brandRegex = new RegExp(`\\W${brand}\\W`, 'i');
    if (title.match(brandRegex)) {
      monitorItem.brand = brand;
      break;
    }
  }

  // Infer some data if missing

  return monitorItem;
}
