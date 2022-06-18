import React, { useEffect, useState } from "react";
import Event from "./event";
import axios from "axios";
import { accessToken, logout } from "./spotify";

function App() {
	const [token, setToken] = useState(null);
	useEffect(() => {
		setToken(accessToken);
	}, []);

	return (
		<div className="App">{!token ? <Event /> : <> <div>Logged in</div><button onClick={logout}>Log out!</button></>}</div>
	);
}

export default App;
