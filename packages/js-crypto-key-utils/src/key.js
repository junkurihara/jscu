/**
 * key.js
 */
import {fromJwkTo, toJwkFrom} from './converter.js';
import {getJwkThumbprint} from './thumbprint.js';
import cloneDeep from 'lodash.clonedeep';
import jseu from 'js-encoding-utils';
import {getJwkType, getSec1KeyType, isAsn1Encrypted, isAsn1Public} from './util.js';

/**
 * Key class to abstract public and private key objects in string or binary.
 *   This class provides functions to interchangeably convert key formats,
 *   and key objects will be used for the root package, js-crypto-utils, as inputs to exposed APIs.
 */
export class Key {
  /**
   * @constructor
   * @param {String} format - Key format: 'jwk', 'der', 'pem' or 'oct' (only for ECC key).
   * @param {JsonWebKey|Uint8Array} key - Key object in the specified format.
   * @param {Object} [options={}] - Required if format='oct', and then it is {namedCurve: String}.
   * @throws {Error} - Throws if the input format and key are incompatible to the constructor.
   */
  constructor(format, key, options={}){
    const localKey = cloneDeep(key);
    const localOpt = cloneDeep(options);

    this._jwk = {};
    this._der = null;
    this._oct = {}; // only for EC keys
    this._current = {jwk: false, der: false, oct: false};

    if(format === 'jwk'){
      this._setJwk(localKey);
    }
    else if (format === 'der' || format === 'pem'){
      if(format === 'der' && !(localKey instanceof Uint8Array)) throw new Error('DerKeyMustBeUint8Array');
      if(format === 'pem' && (typeof localKey !== 'string')) throw new Error('PemKeyMustBeString');
      this._setAsn1(localKey, format);
    }
    else if (format === 'oct'){
      if(typeof localOpt.namedCurve !== 'string') throw new Error('namedCurveMustBeSpecified');
      if(!(localKey instanceof Uint8Array)) throw new Error('OctetKeyMustBeUint8Array');
      this._setSec1(localKey, localOpt.namedCurve);
    }
    else throw new Error('UnsupportedType');
  }

  ///////////////////////////////////////////////////////////
  // private method handling instance variables
  // all instance variables must be set via these methods
  /**
   * Set a key in JWK to the Key object.
   * @param {JsonWebKey} jwkey - The Json Web Key.
   * @private
   */
  _setJwk(jwkey){
    this._type = getJwkType(jwkey); // this also check key format
    this._jwk = jwkey;
    if(this._isEncrypted) this._der = null;
    this._isEncrypted = false;
    this._setCurrentStatus();
  }

  /**
   * Set a key in DER or PEM to the Key object.
   * @param {Uint8Array|String} asn1key - The DER key byte array or PEM key string.
   * @param {String} format - 'der' or 'pem' specifying the format.
   * @private
   */
  _setAsn1(asn1key, format){
    this._type = (isAsn1Public(asn1key, format)) ? 'public' : 'private'; // this also check key format
    this._isEncrypted = isAsn1Encrypted(asn1key, format);
    this._der = (format === 'pem') ? jseu.formatter.pemToBin(asn1key): asn1key;
    if(this._isEncrypted){
      this._jwk = {};
      this._oct = {};
    }
    this._setCurrentStatus();
  }

  /**
   * Set a key in SEC1 = Octet format to the Key Object.
   * @param {Uint8Array} sec1key - The Octet SEC1 key byte array.
   * @param {String} namedCurve - Name of curve like 'P-256'.
   * @private
   */
  _setSec1(sec1key, namedCurve){
    this._type = getSec1KeyType(sec1key, namedCurve);  // this also check key format
    this._oct = { namedCurve, key: sec1key };
    if(this._isEncrypted) this._der = null;
    this._isEncrypted = false;
    this._setCurrentStatus();
  }

  /**
   * Set the current internal status. In particular, manage what the object is based on.
   * @private
   */
  _setCurrentStatus() {
    this._current.jwk = (
      typeof this._jwk.kty === 'string'
      && (this._jwk.kty === 'RSA' || this._jwk.kty === 'EC')
    );
    this._current.der = (
      typeof this._der !== 'undefined'
      && this._der instanceof Uint8Array
      && this._der.length > 0
    );
    this._current.oct = (
      typeof this._oct.key !== 'undefined'
      && this._oct.key instanceof Uint8Array
      && this._oct.key.length > 0
      && typeof this._oct.namedCurve === 'string'
    );
  }
  ///////////////////////////////////////////////////////////
  // (pseudo) public methods allowed to be accessed from outside
  /**
   * Convert the stored key and export the key in desired format.
   * Imported key must be basically decrypted except the case where the key is exported as-is.
   * @param {String} format - Intended format of exported key. 'jwk', 'pem', 'der' or 'oct'
   * @param {Object} [options={}] - Optional arguments.
   * - `options.outputPublic`: boolean - (optional) Derive public key from private key when options.outputPublic = true.
   * - `options.compact`: boolean - (optional) Generate compressed EC public key when format = 'der', 'pem' or 'oct', only for EC key.
   * - `options.encryptParams`: Object - (optional) Generate encrypted der/pem private key when format = 'der' or 'pem'.
   *     * `encryptParams.passphrase`: String - (mandatory if encOption is specified). (Re-)generate encrypted der/pem with the given passphrase
   *     * `encryptParams.algorithm`: String - (optional) 'pbes2' (default), 'pbeWithMD5AndDES-CBC' or 'pbeWithSHA1AndDES'
   *     * `encryptParams.prf`: String - (optional) 'hmacWithSHA256' (default), 'hmacWithSHA384', 'hmacWithSHA512' or 'hmacWithSHA1' when encOptions.algorithm = 'pbes2'.
   *     * `encryptParams.iterationCount`: Number - 2048 (default)
   *     * `encryptParams.cipher`: String - 'aes256-cbc' (default), 'aes128-cbc' or 'des-ede3-cbc'
   * @return {Promise<JsonWebKey|Uint8Array|String>} - Exported key object.
   */
  async export(format = 'jwk', options={}){
    // global assertion
    if(['pem', 'der', 'jwk', 'oct'].indexOf(format) < 0) throw new Error('UnsupportedFormat');

    // return 'as is' without passphrase when nothing is given as 'options'
    // only for the case to export der key from der key (considering encrypted key). expect to be called from getter
    if(this._isEncrypted && this._type === 'private'){
      if((format === 'der' || format === 'pem') && Object.keys(options).length === 0 && this._current.der) {
        return (format === 'pem') ? jseu.formatter.binToPem(this._der, 'encryptedPrivate') : this._der;
      }
      else throw new Error('DecryptionRequired');
    }

    // first converted to jwk
    let jwkey;
    if(this._current.jwk){
      jwkey = this._jwk;
    }
    else if(this._current.oct) { // options.type is not specified here to import jwk
      jwkey = await toJwkFrom('oct', this._oct.key, {namedCurve: this._oct.namedCurve});
    }
    else if(this._current.der) {
      jwkey = await toJwkFrom('der', this._der);
    }
    else throw new Error('InvalidStatus');

    this._setJwk(jwkey); // store jwk if the exiting private key is not encrypted

    // then export as the key in intended format
    if (format === 'der' || format === 'pem') {
      if(typeof options.encryptParams === 'undefined') options.encryptParams = {};
      return await fromJwkTo(format, jwkey, {
        outputPublic: options.outputPublic,
        compact: options.compact,
        passphrase: options.encryptParams.passphrase,
        encOptions: options.encryptParams
      });
    }
    else if (format === 'oct') {
      return await fromJwkTo(format, jwkey, {
        outputPublic: options.outputPublic,
        format: options.output,
        compact: options.compact
      });
    }
    else return jwkey;
  }

  /**
   * Encrypt stored key and set the encrypted key to this instance.
   * @param {String} passphrase - String passphrase.
   * @return {Promise<boolean>} - Always true otherwise thrown.
   * @throws {Error} - Throws if AlreadyEncrypted.
   */
  async encrypt (passphrase){
    if(this._isEncrypted) throw new Error('AlreadyEncrypted');
    const options = {encryptParams: {passphrase}};
    this._setAsn1(await this.export('der', options), 'der');

    return true;
  }

  /**
   * Decrypted stored key and set the decrypted key in JWK to this instance.
   * @param {String} passphrase - String passphrase.
   * @return {Promise<boolean>} - Always true otherwise thrown.
   * @throws {Error} - Throws if NotEncrypted or FailedToDecrypt.
   */
  async decrypt (passphrase){
    if(!this._isEncrypted) throw new Error('NotEncrypted');
    let jwkey;
    if(this._current.der && typeof passphrase === 'string'){
      jwkey = await toJwkFrom('der', this._der, {passphrase}); // type is not specified here to import jwk
    }
    else throw new Error('FailedToDecrypt');
    this._setJwk(jwkey);

    return true;
  }

  /**
   * Conpute JWK thumbprint specified in RFC7638 {@link https://tools.ietf.org/html/rfc7638}.
   * @param {String} [alg='SHA-256'] - Name of hash algorithm for thumbprint computation like 'SHA-256'.
   * @param {String} [output='binary'] - Output format of JWK thumbprint. 'binary', 'hex' or 'base64'.
   * @return {Promise<Uint8Array|String>} - Computed thumbprint.
   * @throws {Error} - Throws if DecryptionRequired.
   */
  async getJwkThumbprint(alg='SHA-256', output='binary'){
    if(this._isEncrypted) throw new Error('DecryptionRequired');
    return await getJwkThumbprint(await this.export('jwk'), alg, output);
  }

  // getters
  /**
   * Get keyType in JWK format
   * @return {Promise<String>} - 'RSA' or 'EC'
   * @throws {Error} - Throws if DecryptionRequired.
   */
  get keyType(){
    if(this._isEncrypted) throw new Error('DecryptionRequired');
    return new Promise( async (resolve, reject) => {
      const jwkey = await this.export('jwk').catch( (e) => {reject(e);});
      resolve(jwkey.kty);
    });
  }

  /**
   * Get jwkThumbprint of this key.
   * @return {Promise<Uint8Array>} - Returns binary thumbprint.
   */
  get jwkThumbprint(){
    return this.getJwkThumbprint();
  }

  /**
   * Check if this is encrypted.
   * @return {boolean}
   */
  get isEncrypted(){ return this._isEncrypted; }

  /**
   * Check if this is a private key.
   * @return {boolean}
   */
  get isPrivate(){ return this._type === 'private'; }

  /**
   * Returns the key in DER format.
   * @return {Promise<Uint8Array>}
   */
  get der(){ return this.export('der'); }

  /**
   * Returns the key in PEM format.
   * @return {Promise<String>}
   */
  get pem(){ return this.export('pem'); }

  /**
   * Returns the key in JWK format
   * @return {Promise<JsonWebKey>}
   */
  get jwk(){ return this.export('jwk'); }

  /**
   * Returns the 'EC' key in Octet SEC1 format.
   * @return {Promise<Uint8Array>}
   */
  get oct(){ return this.export('oct', {output: 'string'});  }
}