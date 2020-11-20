/**
 * key.js
 */
import {fromJwkTo, toJwkFrom} from './converter';
import {getJwkThumbprint} from './thumbprint';
import jseu from 'js-encoding-utils';
import {getJwkType, getSec1KeyType, isAsn1Encrypted, isAsn1Public} from './util';
import {
  DER,
  OctetEC,
  PEM,
  KeyFormat,
  CurveTypes,
  PublicOrPrivate,
  KeyExportOptions,
  JwkThumbprintFormat, HashTypes
} from './typedef';

const cloneDeep = require('lodash.clonedeep');

type CurrentKeyStatus = {jwk: boolean, der: boolean, oct: boolean};
/**
 * Key class to abstract public and private key objects in string or binary.
 *   This class provides functions to interchangeably convert key formats,
 *   and key objects will be used for the root package, js-crypto-utils, as inputs to exposed APIs.
 */
export class Key {
  private _type: PublicOrPrivate|null;
  private _jwk: JsonWebKey|null;
  private _der: Uint8Array|null;
  private _oct: {namedCurve?: CurveTypes, key?: OctetEC};
  private _isEncrypted: boolean;
  private _current: CurrentKeyStatus;
  /**
   * @constructor
   * @param {KeyFormat} format - Key format: 'jwk', 'der', 'pem' or 'oct' (only for ECC key).
   * @param {JsonWebKey|PEM|DER|OctetEC} key - Key object in the specified format.
   * @param {Object} [options={}] - Required if format='oct', and then it is {namedCurve: String}.
   * @throws {Error} - Throws if the input format and key are incompatible to the constructor.
   */
  constructor(format: KeyFormat, key: JsonWebKey|PEM|DER|OctetEC, options: {namedCurve?: CurveTypes}={}){
    const localKey = cloneDeep(key);
    const localOpt = cloneDeep(options);

    this._type = null;
    this._jwk = null;
    this._der = null;
    this._oct = {}; // only for EC keys
    this._isEncrypted = false;
    this._current = {jwk: false, der: false, oct: false};

    if(format === 'jwk'){
      this._setJwk(<JsonWebKey>localKey);
    }
    else if (format === 'der' || format === 'pem'){
      if(format === 'der' && !(localKey instanceof Uint8Array)) throw new Error('DerKeyMustBeUint8Array');
      if(format === 'pem' && (typeof localKey !== 'string')) throw new Error('PemKeyMustBeString');
      this._setAsn1(<any>localKey, format);
    }
    else if (format === 'oct'){
      if(typeof localOpt.namedCurve !== 'string') throw new Error('namedCurveMustBeSpecified');
      if(!(localKey instanceof Uint8Array)) throw new Error('OctetKeyMustBeUint8Array');
      this._setSec1(<Uint8Array>localKey, localOpt.namedCurve);
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
  private _setJwk(jwkey: JsonWebKey){
    this._type = getJwkType(jwkey); // this also check key format
    this._jwk = jwkey;
    if(this._isEncrypted) this._der = null;
    this._isEncrypted = false;
    this._setCurrentStatus();
  }

  /**
   * Set a key in DER or PEM to the Key object.
   * @param {DER|PEM} asn1key - The DER key byte array or PEM key string.
   * @param {String} format - 'der' or 'pem' specifying the format.
   * @private
   */
  private _setAsn1(asn1key: DER|PEM, format: 'der'|'pem'){
    this._type = (isAsn1Public(asn1key, format)) ? 'public' : 'private'; // this also check key format
    this._isEncrypted = isAsn1Encrypted(asn1key, format);
    this._der = <Uint8Array>((format === 'pem') ? jseu.formatter.pemToBin(<PEM>asn1key): asn1key);
    if(this._isEncrypted){
      this._jwk = null;
      this._oct = {};
    }
    this._setCurrentStatus();
  }

  /**
   * Set a key in SEC1 = Octet format to the Key Object.
   * @param {OctetEC} sec1key - The Octet SEC1 key byte array.
   * @param {CurveTypes} namedCurve - Name of curve like 'P-256'.
   * @private
   */
  private _setSec1(sec1key: OctetEC, namedCurve: CurveTypes){
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
  private _setCurrentStatus() {
    this._current.jwk = (this._jwk !== null && (this._jwk.kty === 'RSA' || this._jwk.kty === 'EC') );
    this._current.der = (this._der !== null && this._der.length > 0);
    this._current.oct = (
      typeof this._oct.key !== 'undefined'
      && typeof this._oct.namedCurve !== 'undefined'
      && this._oct.key.length > 0
    );
  }
  ///////////////////////////////////////////////////////////
  // (pseudo) public methods allowed to be accessed from outside
  /**
   * Convert the stored key and export the key in desired format.
   * Imported key must be basically decrypted except the case where the key is exported as-is.
   * @param {String} format - Intended format of exported key. 'jwk', 'pem', 'der' or 'oct'
   * @param {KeyExportOptions} [options={}] - Optional arguments.
   * @return {Promise<JsonWebKey|PEM|DER|OctetEC>} - Exported key object.
   */
  async export(format: KeyFormat = 'jwk', options: KeyExportOptions = {}): Promise<JsonWebKey|PEM|DER|OctetEC>{
    // return 'as is' without passphrase when nothing is given as 'options'
    // only for the case to export der key from der key (considering encrypted key). expect to be called from getter
    if(this._isEncrypted && this._type === 'private'){
      if((format === 'der' || format === 'pem') && Object.keys(options).length === 0 && this._current.der) {
        return (format === 'pem') ? jseu.formatter.binToPem(<DER>(this._der), 'encryptedPrivate') : <DER>this._der;
      }
      else throw new Error('DecryptionRequired');
    }

    // first converted to jwk
    let jwkey: JsonWebKey;
    if(this._current.jwk){
      jwkey = <JsonWebKey>this._jwk;
    }
    else if(this._current.oct) { // options.type is not specified here to import jwk
      jwkey = await toJwkFrom('oct', <OctetEC>this._oct.key, {namedCurve: this._oct.namedCurve});
    }
    else if(this._current.der) {
      jwkey = await toJwkFrom('der', <DER>this._der);
    }
    else throw new Error('InvalidStatus');

    this._setJwk(jwkey); // store jwk if the exiting private key is not encrypted

    // then export as the key in intended format
    if (format === 'der' || format === 'pem') {
      return await fromJwkTo(format, jwkey, {
        outputPublic: options.outputPublic,
        compact: options.compact,
        //passphrase: options.encryptParams.passphrase,
        encryptParams: options.encryptParams
      });
    }
    else if (format === 'oct') {
      return await fromJwkTo(format, jwkey, {
        outputPublic: options.outputPublic,
        output: options.output,
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
  async encrypt (passphrase: string): Promise<boolean>{
    if(this._isEncrypted) throw new Error('AlreadyEncrypted');
    const options = {encryptParams: {passphrase}};
    this._setAsn1(<DER>(await this.export('der', options)), 'der');

    return true;
  }

  /**
   * Decrypted stored key and set the decrypted key in JWK to this instance.
   * @param {String} passphrase - String passphrase.
   * @return {Promise<boolean>} - Always true otherwise thrown.
   * @throws {Error} - Throws if NotEncrypted or FailedToDecrypt.
   */
  async decrypt (passphrase: string): Promise<boolean>{
    if(!this._isEncrypted) throw new Error('NotEncrypted');
    let jwkey;
    if(this._current.der){
      jwkey = await toJwkFrom('der', <DER>this._der, {passphrase}); // type is not specified here to import jwk
    }
    else throw new Error('FailedToDecrypt');
    this._setJwk(jwkey);

    return true;
  }

  /**
   * Conpute JWK thumbprint specified in RFC7638 {@link https://tools.ietf.org/html/rfc7638}.
   * @param {HashTypes} [alg='SHA-256'] - Name of hash algorithm for thumbprint computation like 'SHA-256'.
   * @param {JwkThumbpirntFormat} [output='binary'] - Output format of JWK thumbprint. 'binary', 'hex' or 'base64'.
   * @return {Promise<Uint8Array|String>} - Computed thumbprint.
   * @throws {Error} - Throws if DecryptionRequired.
   */
  async getJwkThumbprint(alg: HashTypes ='SHA-256', output: JwkThumbprintFormat='binary'){
    if(this._isEncrypted) throw new Error('DecryptionRequired');
    return await getJwkThumbprint(<JsonWebKey>(await this.export('jwk')), alg, output);
  }

  // getters
  /**
   * Get keyType in JWK format
   * @return {Promise<String>} - 'RSA' or 'EC'
   * @throws {Error} - Throws if DecryptionRequired.
   */
  get keyType(): Promise<string> {
    if(this._isEncrypted) throw new Error('DecryptionRequired');
    return new Promise( (resolve, reject) => {
      this.export('jwk')
        .then( (r) => {
          resolve( <string>((<JsonWebKey>r).kty));
        })
        .catch( (e) => {reject(e);});
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
   * @return {Promise<DER>}
   */
  get der(){ return this.export('der'); }

  /**
   * Returns the key in PEM format.
   * @return {Promise<PEM>}
   */
  get pem(){ return this.export('pem'); }

  /**
   * Returns the key in JWK format
   * @return {Promise<JsonWebKey>}
   */
  get jwk(){ return this.export('jwk'); }

  /**
   * Returns the 'EC' key in Octet SEC1 format.
   * @return {Promise<OctetEC>}
   */
  get oct(){ return this.export('oct', {output: 'string'});  }
}
