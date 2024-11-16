function gfMulX(tweak) {
  const POLY = 0x87;
  let carry = (tweak[15] & 0x80) ? 1 : 0;
  for (let i = 15; i > 0; i--) {
    tweak[i] = ((tweak[i] << 1) | (tweak[i - 1] >> 7)) & 0xff;
  }
  tweak[0] = (tweak[0] << 1) & 0xff;
  if (carry) tweak[15] ^= POLY;
  return tweak;
}

function hexToBuffer(hexString) {
  if (hexString.length % 2 !== 0) {
    throw new Error('Invalid hex string');
  }

  let byteArray = new Uint8Array(hexString.length / 2);

  for (let i = 0; i < hexString.length; i += 2) {
    byteArray[i / 2] = parseInt(hexString[i] + hexString[i + 1], 16);
  }

  return byteArray.buffer;
}

async function aesEcbEncrypt(key, data) {
  // Import the encryption key
  let ikey = crypto.subtle.importKey(
    "raw",
    hexToBuffer(key),
    { name: "AES-ECB" },
    false,
    ["encrypt"]
  );

  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-ECB" },
    ikey,
    data
  );

  return encryptedData;
}

async function aesEcbDecrypt(key, data) {
  let ikey = crypto.subtle.importKey(
    "raw",
    hexToBuffer(key),
    { name: "AES-ECB" },
    false,
    ["decrypt"]
  );

  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-ECB" },
    ikey,
    data
  );

  return decryptedData;
}

export async function aesXtsDecrypt(ciphertext, key1, key2, sectorIndex) {
  const blockSize = 16;
  const blocks = Math.ceil(ciphertext.length / blockSize);
  let result = new Uint8Array(ciphertext.length);

  let tweak = new Uint8Array(blockSize);
  tweak.set(await aesEcbEncrypt(key2, new Uint8Array(new Uint32Array([0, 0, 0, sectorIndex]).buffer)));

  for (let i = 0; i < blocks; i++) {
    let block = ciphertext.slice(i * blockSize, (i + 1) * blockSize);
    if (block.length < blockSize) {
      block = new Uint8Array(blockSize);
      block.set(ciphertext.slice(i * blockSize));
    }

    for (let j = 0; j < blockSize; j++) {
      block[j] ^= tweak[j];
    }

    let decryptedBlock = await aesEcbDecrypt(key1, block);

    for (let j = 0; j < blockSize; j++) {
      decryptedBlock[j] ^= tweak[j];
    }

    result.set(decryptedBlock.slice(0, block.length), i * blockSize);

    tweak = gfMulX(tweak);
  }
  return result;
}