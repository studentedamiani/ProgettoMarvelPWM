import { createHash } from 'crypto';
/**
 * Generates MD5 hash from a string
 * @param {string} str - String to hash
 * @returns {string} MD5 hash
 */
export function getMD5(str) {
    return createHash('md5')
        .update(str)
        .digest('hex');
}