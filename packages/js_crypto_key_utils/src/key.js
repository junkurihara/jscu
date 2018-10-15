/**
 * key.js
 */
import {fromJwkTo, toJwkFrom} from './converter.js';
import {getJwkThumbprint} from './thumbprint.js';

import jseu from 'js-encoding-utils';
import {getJwkType, getSec1KeyType, isAsn1Encrypted, isAsn1Public} from './util.js';


// key class
export class Key {
  constructor(format, key, {namedCurve}){
    this._jwk = {};
    this._der = new Uint8Array([]);
    this._oct = {namedCurve: '', key: new Uint8Array([])};
    this._current = {jwk: false, der: false, oct: false};

    if(format === 'jwk'){
      this._setJwk(key);
    }
    else if (format === 'der' || format === 'pem'){
      this._setAsn1(key, format);
    }
    else if (format === 'oct'){
      if(!namedCurve) throw new Error('namedCurveMustBeSpecified');
      this._setSec1(key, namedCurve);
    }
    else throw new Error('UnsupportedType');

    this._setCurrentStatus();
  }

  _setJwk(jwkey){
    this._type = getJwkType(jwkey); // this also check key format
    this._isEncrypted = false;
    this._jwk = jwkey;
  }

  _setAsn1(asn1key, format){
    this._type = (isAsn1Public(asn1key, format)) ? 'public' : 'private'; // this also check key format
    this._isEncrypted = isAsn1Encrypted(asn1key, format);
    this._der = (format === 'pem') ? jseu.formatter.pemToBin(asn1key): asn1key;
  }

  _setSec1(sec1key, namedCurve){
    this._type = getSec1KeyType(sec1key, namedCurve);  // this also check key format
    this._isEncrypted = false;
    this._oct = { namedCurve, key: sec1key };
  }

  _setCurrentStatus() {
    this._current.jwk = (Object.keys(this._jwk).length !== 0);
    this._current.der = (this._der.length !== 0);
    this._current.oct = (this._oct.key.length !== 0 && this._oct.namedCurve);
  }

  decrypt (passphrase){ //
    this._isEncrypted = false;
  }

  // getters
  async to(format = 'jwk', {passphrase, type, compact, output, encOptions}){

    // first converted to jwk
    this._jwk = await toJwkFrom('der', this._der, {type, passphrase});
    this._jwk = await toJwkFrom('oct', this._oct.key, {type, namedCurve: this._oct.namedCurve});

  }

  get isEncrypted(){
    return this._isEncrypted;
  }

  get isPrivate(){
  }

  get der(){
  }

  get pem(){
  }

  get jwk(){
  }
}