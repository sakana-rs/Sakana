if (!DataView.prototype.getUint64) {
  DataView.prototype.getUint64 = function(byteOffset, littleEndian) {
    const left =  this.getUint32(byteOffset, littleEndian);
    const right = this.getUint32(byteOffset+4, littleEndian);

    return littleEndian ? BigInt(left) + 2n**32n*BigInt(right) : 2n**32n *BigInt(left)+ BigInt(right);
  }
}