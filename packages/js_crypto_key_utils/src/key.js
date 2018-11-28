/**
 * key.js
 */
import {fromJwkTo, toJwkFrom} from './converter.js';
import {getJwkThumbprint} from './thumbprint.js';
import cloneDeep from 'lodash.clonedeep'
import jseu from 'js-encoding-utils';
import {getJwkType, getSec1KeyType, isAsn1Encrypted, isAsn1Public} from './util.js';

/**
 * Key class
 */
export class Key {
  /**
   * @constructor
   * @param format
   * @param key
   * @param options
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
  _setJwk(jwkey){
    this._type = getJwkType(jwkey); // this also check key format
    this._jwk = jwkey;
    if(this._isEncrypted) this._der = null;
    this._isEncrypted = false;
    this._setCurrentStatus();
  }

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

  _setSec1(sec1key, namedCurve){
    this._type = getSec1KeyType(sec1key, namedCurve);  // this also check key format
    this._oct = { namedCurve, key: sec1key };
    if(this._isEncrypted) this._der = null;
    this._isEncrypted = false;
    this._setCurrentStatus();
  }

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
   * Wrapper of converter. Imported key must be basically decrypted except the case where the key is exported as-is.
   * @param format {string}: 'jwk', 'pem', 'der' or 'oct'
   * @param options {object}:
   * - options.outputPublic {boolean}: (optional) [format = *]
   *     derive public key from private key when options.outputPublic = true.
   * - options.compact {boolean}: (optional) [format = 'der', 'pem' or 'oct', only for EC key]
   *     generate compressed EC public key.
   * - options.encryptParams {object}: (optional) [format = 'der' or 'pem'] options to generate encrypted der/pem private key.
   *     * encryptParams.passphrase {string}: (mandatory if encOption is specified).
   *          (re-)generate encrypted der/pem with the given passphrase
   *     * encryptParams.algorithm {string}: (optional) 'pbes2' (default), 'pbeWithMD5AndDES-CBC' or 'pbeWithSHA1AndDES'
   *     * encryptParams.prf {string}: (optional) [encOptions.algorithm = 'pbes2'],
   *         'hmacWithSHA256' (default), 'hmacWithSHA384', 'hmacWithSHA512' or 'hmacWithSHA1'
   *     * encryptParams.iterationCount {integer}: 2048 (default)
   *     * encryptParams.cipher {string}: 'aes256-cbc' (default), 'aes128-cbc' or 'des-ede3-cbc'
   * @return {Promise<*>}
   */
  async export(format = 'jwk', options={}){
    // global assertion
    if(['pem', 'der', 'jwk', 'oct'].indexOf(format) < 0) throw new Error('UnsupportedFormat');

    // return 'as is' without passphrase when nothing is given as 'options'
    // only for the case to export der key from der key (considering encrypted key). expect to be called from getter
    if((format === 'der' || format === 'pem') && Object.keys(options).length === 0
      && this._isEncrypted === true && this._type === 'private' && this._current.der)
    {
      return (format === 'pem') ? jseu.formatter.binToPem(this._der, 'encryptedPrivate') : this._der;
    }
    if(this._isEncrypted) throw new Error('DecryptionRequired');

    let jwkey;
    // first converted to jwk
    if(this._current.jwk){
      jwkey = this._jwk;
    }
    else {
      // options.type is not specified here to import jwk
      if(this._current.oct) {
        jwkey = await toJwkFrom('oct', this._oct.key, {namedCurve: this._oct.namedCurve});
      }
      else if(this._current.der){
        jwkey = await toJwkFrom('der', this._der);
      }
      else throw new Error('InvalidStatus');

      this._setJwk(jwkey); // store jwk if the exiting private key is not encrypted
    }

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
   * @param passphrase {string}
   * @return {Promise<boolean>}
   */
  async encrypt (passphrase){
    if(this._isEncrypted) throw new Error('AlreadyEncrypted');
    const options = {encryptParams: {passphrase}};
    this._setAsn1(await this.export('der', options), 'der');

    return true;
  }

  /**
   * Decrypted stored key and set the decrypted key in JWK to this instance.
   * @param passphrase {string}
   * @return {Promise<boolean>}
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

  async getJwkThumbprint(alg='SHA-256', output='binary'){
    if(this._isEncrypted) throw new Error('DecryptionRequired');
    return await getJwkThumbprint(await this.export('jwk'), alg, output);
  }

  // getters
  get keyType(){
    if(this._isEncrypted) throw new Error('DecryptionRequired');
    return new Promise( async (resolve, reject) => {
      const jwkey = await this.export('jwk').catch( (e) => {reject(e);});
      resolve(jwkey.kty);
    });
  }

  get jwkThumbprint(){
    return this.getJwkThumbprint();
  }

  get isEncrypted(){ return this._isEncrypted; }

  get isPrivate(){ return this._type === 'private'; }

  get der(){ return this.export('der'); }

  get pem(){ return this.export('pem'); }

  get jwk(){ return this.export('jwk'); }

  get oct(){ return this.export('oct', {output: 'string'});  }
}