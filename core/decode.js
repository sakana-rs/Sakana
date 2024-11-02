export function Decode(file, keys) {
  return new Promise(async(resolve, reject) => {
    // TODO: make "big array buffers" or something similar to allow over 2^31 bytes
    let buffer;
    try {
      buffer = await file.arrayBuffer();
    } catch(err) {
      reject('File too large / corrupted');
      return;
    }
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
    const stringTableOffset = headerOffset + (24 * fileCount);

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
      // Data
      let offset = Number(view.getBigUint64(headerOffset + i * 24, true));
      let size = Number(view.getBigUint64(headerOffset + i * 24 + 8, true));

      // File name
      let nameOffset = view.getUint32(headerOffset + i * 24 + 16, true);
      let nameBytes = new Uint8Array(buffer.slice(stringTableOffset + nameOffset));
      let name = new TextDecoder("utf-8").decode(nameBytes.subarray(0, nameBytes.indexOf(0)));

      // File body
      let body = new Uint8Array(buffer.slice(offset, offset + size));

      // Push file
      files.push({ offset, name, size, body });
    }

    resolve({
      stringTable,
      fileCount: fileCount,
      files: files
    });
  });
}