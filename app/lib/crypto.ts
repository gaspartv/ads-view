import { createCipheriv, randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';

export async function encrypt(text: string): Promise<string> {
  const algorithm = process.env.ENCRYPTION_ALGORITHM;
  const keySecret = process.env.ENCRYPTION_KEY;
  const salt = process.env.ENCRYPTION_SALT;

  if (!algorithm || !keySecret || !salt) {
    throw new Error('Encryption environment variables are missing');
  }

  // Generate a 16-byte initialization vector (for AES CTR)
  const iv = randomBytes(16);

  // Derive the 32-byte key using scrypt
  const key = (await promisify(scrypt)(keySecret, salt, 32)) as Buffer;

  // Create cipher
  const cipher = createCipheriv(algorithm, key, iv);

  // Encrypt the text
  const encryptedText = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);

  // Return the IV and encrypted text formatted as "ivHex:encryptedHex"
  return `${iv.toString('hex')}:${encryptedText.toString('hex')}`;
}
