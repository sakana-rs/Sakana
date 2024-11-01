export function Decode(file, keys) {
  return new Promise(async(resolve, reject) => {
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);
  
    // Check magic number "PFS0" for NSP format
    const magicNumber = String.fromCharCode(
      view.getUint8(0),
      view.getUint8(1),
      view.getUint8(2),
      view.getUint8(3)
    );
    if (magicNumber !== "PFS0") {
      reject('Invalid file');
      return;
    }

    // Parse header
    const fileCount = view.getUint32(4, true); // little-endian
    console.log("Number of files:", fileCount);
    resolve('');
  });
}