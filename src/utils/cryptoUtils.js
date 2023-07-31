import CryptoJS from 'crypto-js'

const encryptionKey = `${import.meta.env.VITE_ENCRIPTION_KEY}`

export function encryptData(data) {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    encryptionKey
  ).toString()
  return encrypted
}

export function decryptData(encryptedData) {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, encryptionKey)
  const decryptedData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
  return decryptedData
}
