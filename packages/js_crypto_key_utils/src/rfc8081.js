/**
 * rfc8081
 */

import params, {getAlgorithmFromOid} from './params.js';
import {DesEde3CbcParams, PBEParameter, PBES2Params, PBKDF2Params} from './asn1def.js';


export function decryptEncryptedPrivateKeyInfo(decoded){
  // TODO: check encryptionAlgorithm for protected key and decrypt the encryptedData
  decoded = decodeEncryptedPrivateKeyInfo(decoded);

  const nodeUtil = require('util');
  console.log(nodeUtil.inspect(decoded,false,null));

  return decoded;
}

const getAlgorithmFromOidStrict = (oid, dict) => {
  const array = getAlgorithmFromOid(oid, dict);
  if (array.length === 0) throw new Error('UnsupportedAlgorithm');
  return array[0];
};

function decodeEncryptedPrivateKeyInfo(decoded){
  // encryptionAlgorithm.algorithm
  const encryptionAlgorithm = getAlgorithmFromOidStrict(decoded.encryptionAlgorithm.algorithm, params.passwordBasedEncryptionSchemes);
  decoded.encryptionAlgorithm.algorithm = encryptionAlgorithm;

  ////////////////////////////////////////////////
  // encryptionAlgorithm.parameters
  if (encryptionAlgorithm === 'pbes2') {
    const pbes2Params = PBES2Params.decode(decoded.encryptionAlgorithm.parameters, 'der');

    ////////////////////////////////////////////////
    // keyDerivationFunc
    const kdfAlgorithm = getAlgorithmFromOidStrict(pbes2Params.keyDerivationFunc.algorithm, params.keyDerivationFunctions);
    pbes2Params.keyDerivationFunc.algorithm = kdfAlgorithm;

    if (kdfAlgorithm === 'pbkdf2') {
      const pbkdf2Params = PBKDF2Params.decode(pbes2Params.keyDerivationFunc.parameters, 'der');
      const pbkdf2Prf = getAlgorithmFromOidStrict(pbkdf2Params.prf.algorithm, params.pbkdf2Prfs);
      pbkdf2Params.prf.algorithm = pbkdf2Prf;

      pbes2Params.keyDerivationFunc.parameters = pbkdf2Params;
    }

    ////////////////////////////////////////////////
    //encryptionScheme
    const encryptionScheme = getAlgorithmFromOidStrict(pbes2Params.encryptionScheme.algorithm, params.encryptionSchemes);
    pbes2Params.encryptionScheme.algorithm = encryptionScheme;

    if(encryptionScheme === 'des-ede3-cbc'){
      pbes2Params.encryptionScheme.parameters = DesEde3CbcParams.decode(pbes2Params.encryptionScheme.parameters, 'der');
    } // TODO: Other Encryption Scheme

    decoded.encryptionAlgorithm.parameters = pbes2Params;
  }
  else {
    decoded.encryptionAlgorithm.parameters = PBEParameter.decode(decoded.encryptionAlgorithm.parameters, 'der');
  }

  return decoded;
}