window._modloader_encryption = new (class BSEncryption {
    decrypt(buffer) { return buffer; }
    encrypt(buffer) { return buffer; }
    decryptAsset(buffer) { return buffer; }
    encryptAsset(buffer) { return buffer; }
});