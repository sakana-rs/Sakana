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
    const stringTableOffset = view.getUint32(12, true);

    // Get files
    let files = [];
    const headerOffset = 16;

    for (let i = 0; i<fileCount; i++) {
      // File name
      let nameOffset = view.getUint32(headerOffset + i * 24 + 16, true);
      let nameBytes = new Uint8Array(buffer.slice(stringTableOffset + nameOffset));
      let name = new TextDecoder("utf-8").decode(nameBytes.subarray(0, nameBytes.indexOf(0)));

      // Push file
      files.push({
        offset: Number(view.getBigUint64(headerOffset + i * 24, true)),
        name,
        size: Number(view.getBigUint64(headerOffset + i * 24 + 8, true)),
        body: new Uint8Array(buffer.slice(offset, offset + size))
      });
    }

    resolve({
      fileCount: fileCount,
      files: files
    });
  });
}