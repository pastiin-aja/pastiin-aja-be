import jwt from "jsonwebtoken";

class AccessTokenModel {
  generateAccessToken = (user) => {
    const expireTime = 60 * 60 * 24 * 3; // 3 days
    const expirationDate = Math.floor(Date.now() / 1000) + expireTime;
    const payload = {
      user_id: user.user_id,
      username: user.username,
      exp: expirationDate,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    return accessToken;
  };

	verifyExpired = (token) => {
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
		const currentTimestamp = Math.floor(Date.now() / 1000);

		if (decoded.expiredAt < currentTimestamp) {
			return true;
		}
		return false;
	};
} 

export default new AccessTokenModel();