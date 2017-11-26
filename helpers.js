const qrCode = require('qrcode-npm');
const User = require('./db/models/user');

let helpers = {};

// Returns image string of QR code.
helpers.getQRCode = function(data) {
  let qr = qrCode.qrcode(4, 'M');
  qr.addData(data);
  qr.make();
  let img = qr.createImgTag(4)
  let reg = /"([^"]*)"/g;
  let result = img.match(reg)[0];
  result = result.substring(1, result.length - 1)
  return result;
};

helpers.signup = async function(data) {
	let response = {
		status: null,
		message: null
	};
	const [user] = await User.find({ username: data.username }, 'username password').exec();
	if (user == null) {
		const newUser = new User({
			username: data.username,
			password: User.generateHash(data.password),
		});
		const result = await newUser.save();
		response.status = true,
		response.message = 'SERVER: Signup successful.'
		return response;
	} else {
		response.status = false,
		response.message = `SERVER: ${data.username} already exists.`
		return response;
	}
};

helpers.login = async function(data, callback) {
	let response = {
		status: null,
		message: null
	};
	const [user] = await User.find({ username: data.username }, 'username password').exec();
	if (user == null) {
		response.status = false;
		response.message = `SERVER: User ${data.username} not found.`;
		return response;
	} else {
		const isValidPassword = await User.validatePassword(data.password, user.password);
		if (isValidPassword) {
			response.status = true;
			response.message = `SERVER: Login successful.`;
			return response;
		}
		response.status = false;
		response.message = `SERVER: Password does not match.`;
		return response;
	}
};

module.exports = helpers;