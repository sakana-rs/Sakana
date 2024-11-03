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
      files: files
    });
  });
}