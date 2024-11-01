import './pollyfill.js'

export function Decode(file, keys) {
  return new Promise(async(resolve, reject) => {
    let buffer;
    try {
      buffer = await file.arrayBuffer();
    } catch(err) {
      reject('File too large / corrupted')
    }
    const view = new DataView(buffer);
  
    // Check magic number "PFS0" for NSP format
    const magicNumber = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
    if (magicNumber !== "PFS0") {
      reject('Invalid file');
      return;
    }

    // Parse header
    const fileCount = view.getUint32(4, true); // little-endian
    const stringTableOffset = view.getUint32(12, true);

    // Get files
    let files = [];
    const headerOffset = 16;

    for (let i = 0; i<fileCount; i++) {
      files.push({
        offset: view.getUint64(headerOffset + i * 24, true),
        size: view.getUint64(headerOffset + i * 24 + 8, true),
        nameOffset: view.getUint32(headerOffset + i * 24 + 16, true)
      });
    }

    // Extract file names
    const textDecoder = new TextDecoder("utf-8");
    files.forEach(file => {
      let nameBytes = new Uint8Array(buffer.slice(stringTableOffset + file.nameOffset));
      file.name = textDecoder.decode(nameBytes.subarray(0, nameBytes.indexOf(0)));
    })

    resolve({
      fileCount: fileCount,
      files: files
    });
  });
}