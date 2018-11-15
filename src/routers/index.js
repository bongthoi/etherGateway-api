import express from 'express';
import server_config from '../../configs/server_config';
import VSCTokenService from '../services/vscTokenService';

/** */
let router = express.Router();
let vscTokenService=new VSCTokenService();

/**public */
router.get(server_config.api_url+"getbalance/:address", async(req, res) => {
	try {
		let result=await vscTokenService.getBalance(req.params.address);

		res.json(result);
	} catch (error) {
		res.json({"Error :":error+""});
	}
	
});


/**export */
module.exports = router;