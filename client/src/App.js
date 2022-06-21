import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { accessToken, logout } from "./spotify";

import { Login, Profile, TopArtists, TopTracks } from "./views/index";

import { GlobalStyle } from "./styles";
import styled from "styled-components/macro";

const StyledLogoutButton = styled.button`
	position: absolute;
	top: var(--spacing-sm);
	right: var(--spacing-md);
	padding: var(--spacing-xs) var(--spacing-sm);
	background-color: rgba(0, 0, 0, 0.7);
	color: var(--white);
	font-size: var(--fz-sm);
	font-weight: 700;
	border-radius: var(--border-radius-pill);
	z-index: 10;
	@media (min-width: 768px) {
		right: var(--spacing-lg);
	}
`;

function ScrollToTop() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
}

function App() {
	const [token, setToken] = useState(null);

	useEffect(() => {
		setToken(accessToken);
	}, []);

	return (
		<div className="App">
			<GlobalStyle />
			{!token ? (
				<Login />
			) : (
				<>
					<StyledLogoutButton onClick={logout}>Log Out</StyledLogoutButton>
					<ScrollToTop />
					<Routes>
						<Route path="/" element={<Profile />} />
						<Route path="/top-tracks" element={<TopTracks />} />
						<Route path="/top-artists" element={<TopArtists />} />
						<Route path="/playlists/:id" element={<div>Paylist track</div>} />
						<Route path="/playlists" element={<div>Playlists</div>} />
					</Routes>
				</>
			)}
		</div>
	);
}

export default App;
