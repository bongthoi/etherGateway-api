import Web3 from 'web3';
import VSCTokenRepo from '../repositories/vscTokenRepo';
import ether_config from '../../configs/ether_config';

const provider = ether_config.provider;

// khoi tao web3
const web3 = new Web3(provider);
let vscTokenRepo = new VSCTokenRepo();


class VSCTokenService {
  constructor() { };

  async getBalance(_address) {
    let method = "vscTokenService/getBalance";
    console.log(method + "/address at: " + _address +"  -->start");

    if (_address) {
      try {
        var ethBalance = vscTokenRepo.convertWeiToEth(await web3.eth.getBalance(_address)) || '0';
        var tokenBalance = await vscTokenRepo.getContract().methods.balances(_address).call() || '0';

        console.log(method + " -->success");
        return { "ethBalance": ethBalance, "tokenBalance": tokenBalance };
      } catch (error) {
        console.log(method + " -->failed");
      }
    }
  }

}


module.exports = VSCTokenService;