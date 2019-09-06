//@ts-check


const path = require("path");
const fs = require("fs");
//const { promisify } = require("util");
const crypto = require("crypto");const iv = new Buffer("1S3a5L7I)2%4ae_8");;

module.exports = {
   /**
     * 对字符串进行 md5
     * @param {string} src_str 
     * @returns {string}
     */
    md5(src_str){
        if(!src_str){
            src_str = `daiWcdZddlw324234saewesd`;
        }
        var md5 = crypto.createHash('md5');
        return md5.update(src_str).digest('hex');
    },

    /**
     * 使用密钥对原文进行加密
     * @param {string} encrypt_key 加密密钥
     * @param {string} src_content 原文     
     * @returns {string}
     */
    encrypt(encrypt_key , src_content ){
        
        var cipherChunks = [];
        let key_md5 = this.md5(encrypt_key);
        var cipher = crypto.createCipheriv('aes-256-cbc', key_md5 , iv);
        cipher.setAutoPadding(true);
        cipherChunks.push(cipher.update(src_content, 'utf8', 'base64'));
        cipherChunks.push(cipher.final('base64'));
        return cipherChunks.join('');
    },

    /**
     * 对密文解密
     * @param {string} encrypt_key 加密密钥
     * @param {string} encrypt_content 加密的密文
     * @returns {string}
     */
    decrypt(encrypt_key , encrypt_content){
        if (!encrypt_content) {
            return "";
        }
        
        
        var cipherChunks = [];
        let key_md5 = this.md5(encrypt_key);
        var decipher = crypto.createDecipheriv('aes-256-cbc', key_md5, iv);
        decipher.setAutoPadding(true);
        cipherChunks.push(decipher.update(encrypt_content, 'base64', 'utf8'));
        cipherChunks.push(decipher.final('utf8'));
        return cipherChunks.join('');
    }

};
  