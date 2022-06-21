require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.static(path.resolve(__dirname, './client/build')));
const axios = require("axios");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;
const PORT = process.env.PORT || 8888;

const path = require('path');
console.log(REDIRECT_URI);

//utility function

const generateRandomString = (length) => {
	var result = "";
	var characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

const stateKey = "spotify_auth_state";

app.get("/login", (req, res) => {
	const state = generateRandomString(16);
	res.cookie(stateKey, state);

	const scope = ["user-read-private", "user-read-email", "user-top-read"].join(
		" "
	);
	const queryParams = new URLSearchParams({
		client_id: CLIENT_ID,
		response_type: "code",
		redirect_uri: REDIRECT_URI,
		state: state,
		scope: scope,
	}).toString();

	res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get("/callback", (req, res) => {
	const code = req.query.code || null;

	axios({
		method: "post",
		url: "https://accounts.spotify.com/api/token",
		data: new URLSearchParams({
			grant_type: "authorization_code",
			code: code,
			redirect_uri: REDIRECT_URI,
		}),
		headers: {
			"content-type": "application/x-www-form-urlencoded",
			Authorization: `Basic ${new Buffer.from(
				`${CLIENT_ID}:${CLIENT_SECRET}`
			).toString("base64")}`,
		},
	})
		.then((response) => {
			if (response.status === 200) {
				// console.log(response.data.refresh_token)
				// console.log(response.data.access_token)
				const { refresh_token, access_token, token_type, expires_in } =
					response.data;
				//urlsearchparamsobj
				const qParams = new URLSearchParams({
					access_token,
					refresh_token,
					expires_in,
				});
				res.redirect(`${FRONTEND_URI}?${qParams}`);
				// axios
				// 	.get(
				// 		`http://localhost:8888/refresh_token?refresh_token=${refresh_token}`
				// 	)
				// 	.then((response) => {
				// 		res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
				// 	})
				// 	.catch((error) => {
				// 		res.send(error);
				// 	});
			} else {
				res.redirect(`/?${querystring.stringify({ error: "invalid_token" })}`);
			}
		})
		.catch((error) => {
			res.send(error);
		});
});

//refresh token

app.get("/refresh_token", (req, res) => {
	const { refresh_token } = req.query;

	axios({
		method: "post",
		url: "https://accounts.spotify.com/api/token",
		data: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refresh_token,
		}),
		headers: {
			"content-type": "application/x-www-form-urlencoded",
			Authorization: `Basic ${new Buffer.from(
				`${CLIENT_ID}:${CLIENT_SECRET}`
			).toString("base64")}`,
		},
	})
		.then((response) => {
			res.send(response.data);
		})
		.catch((error) => {
			res.send(error);
		});
});
app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  });
app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});
