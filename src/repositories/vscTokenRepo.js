import Web3 from 'web3';
import path from 'path';
import cjson from 'cjson';
import TX from 'ethereumjs-tx';
import ether_config from '../../configs/ether_config.json';

// contract details
const provider = ether_config.provider;
const contractAddress = ether_config.contractAddress;
const privateKey = new Buffer(ether_config.privateKey, 'hex');
const defaultAccount = ether_config.defaultAccount;
const etherscanLink = ether_config.etherscanLink;

// khoi tao web3
const web3 = new Web3(provider)
var contract = null;

class VSCTokenRepo {
  constructor() { };

  // Chuyen doi tu Wei toi Eth
  convertWeiToEth(stringValue) {
    if (typeof stringValue != 'string') {
      stringValue = String(stringValue);
    }
    return web3.utils.fromWei(stringValue, "ether");
  }

  //khoi tao Contract
  getContract() {
    if (contract === null) {
      var abi = ether_config.abi;
      var c = new web3.eth.Contract(abi, contractAddress);
      contract = c.clone();
    }
    return contract;
  }

  // Send Signed Transaction
  async sendSignTransaction(rawTrans) {
    // Initiate values required by the dataTrans
    if (rawTrans) {
      var txCount = await web3.eth.getTransactionCount(defaultAccount) // needed for nonce
      var abiTrans = rawTrans.encodeABI() // encoded contract method 

      var gas = await rawTrans.estimateGas()
      var gasPrice = await web3.eth.getGasPrice()
      gasPrice = Number(gasPrice)
      gasPrice = gasPrice * 2
      var gasLimit = gas * 4

      // Initiate the transaction data
      var dataTrans = {
        nonce: web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(gasLimit),
        gasPrice: web3.utils.toHex(gasPrice),
        to: contractAddress,
        data: abiTrans
      }

      // sign transaction
      var tx = new TX(dataTrans)
      tx.sign(privateKey)

      // after signing send the transaction
      return await sendSigned(tx)
    } else {
      throw new console.error('Encoded raw transaction was not given.');
    }

  }

  sendSigned(tx) {
    return new Promise(function (resolve, reject) {
      // send the signed transaction
      web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'))
        .once('transactionHash', function (hash) {
          var result = {
            'status': 'sent',
            'url': etherscanLink + hash,
            'message': 'click the given url to verify status of transaction'
          }
          resolve(result)
        })
        .then(out => { console.log(out) })
        .catch(err => {
          reject(err)
        })
    })
  }

}


module.exports = VSCTokenRepo;