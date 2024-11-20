import { aesXtsDecrypt } from './aes.js'

function DecodeNSP(buffer) {
  return new Promise(async(resolve, reject) => {
    const view = new DataView(buffer);

    // Check magic number "PFS0" for NSP format
    const magicNumber = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
    if (magicNumber !== "PFS0") {
      reject('Invalid file');
      return;
    }

    // Parse header (little-endian)
    const fileCount = view.getUint32(4, true);
    const headerOffset = 16;
    const sizeStringTable = view.getUint32(8, true);
    const stringTableOffset = headerOffset + (24 * fileCount);
    const dataOffset = stringTableOffset + sizeStringTable;

    // String table
    let stringTable = [];
    let passedStrings = 0;
    let idx = stringTableOffset;
    let constructString = '';
    while (passedStrings<fileCount) {
      let cur = view.getUint8(idx);
      if (cur == 0) {
        stringTable.push(constructString);
        constructString = '';
        passedStrings += 1;
      } else {
        constructString += String.fromCharCode(cur);
      }
      idx += 1;
    }

    // Get files
    let files = [];

    for (let i = 0; i<fileCount; i++) {
      const offset = headerOffset + i * 24;
      const fileOffset = view.getBigUint64(offset, true);
      const size = view.getBigUint64(offset + 8, true);
      const filenameOffset = view.getUint32(offset + 16, true);

      files.push({ offset, fileOffset, size, filenameOffset, name: stringTable[i] });
    }

    files.forEach((file) => {
      const contentOffset = dataOffset + Number(file.fileOffset);
      const fileContent = buffer.slice(contentOffset, contentOffset+Number(file.size));

      file.body = fileContent;
    });

    resolve({
      stringTable,
      fileCount,
      files
    });
  });
}

function DecodeNCA(file, keys) {
  console.log('[Sakana] Loading nca: '+file.name);
  return new Promise(async(resolve, reject) => {
    const buffer = file.body;
    const headerSize = 0x400;

    let key1 = keys.header_key.slice(0,32);
    let key2 = keys.header_key.slice(32,64);

    // Parse the NCA header
    let headerEnc = buffer.slice(0, headerSize);
    headerEnc = new Uint8Array(headerEnc);
    const headerDec = aesXtsDecrypt(headerEnc, key1, key2, 0);
    const headerView = new DataView(headerDec);

    // Validate magic number
    const magicNumber = headerDec.slice(0x100, 0x104).toString();
    if (magicNumber !== 'NCA3') {
      if (['NCA0', 'NCA2'].includes(magicNumber)) reject('Only NCA3 is supported, recived: '+magicNumber);
      reject('Invalid file');
    }

    // Parse the header fields
    const header = {
      distType: headerDec[0x104],
      contentType: headerDec[0x105],
      keyGenerationOld: headerDec[0x106],
      keyAreaEncryptionKeyIndex: headerDec[0x107],
      contentSize: headerView.getUint32(0x108, true),
      programId: headerView.getBigInt64(0x10C, true),
      contentIndex: headerView.getUint32(0x114, true),
      rightsId: headerDec.slice(0x120, 0x130)
    };

    console.log("Parsed NCA Header:", header);
    resolve(header);
  });
}

export function Decode(file, keyFile) {
  return new Promise(async(resolve, reject) => {
    // TODO: make "big array buffers" or something similar to allow over 2^31 bytes in buffer length
    let buffer;
    try {
      buffer = await file.arrayBuffer();
    } catch(err) {
      reject('File too large / corrupted');
      return;
    }

    DecodeNSP(buffer)
      .then(data => {
        let keyReader = new FileReader();
        keyReader.onload = (evt) => {
          let keys = {};
          evt.target.result
            .split('\n')
            .map(key => {
              let k = key.split(' = ');
              keys[k[0]] = k[1];
            });

          let files = [];
          data.files.forEach(file => {
            files.push(DecodeNCA(file, keys));
          })
          resolve(data);
        };
        keyReader.readAsText(keyFile);
      })
      .catch(err => {
        reject(err)
      })
  })
}