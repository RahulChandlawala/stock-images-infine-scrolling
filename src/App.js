import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
// access key = yj84HiK2ujROOh6Q2EC8hiSrR336XP_eY5xaSg4Zuhw
// secert kry = Uv8ReDwnwuqv-wbxK0FKFu0_VabcSwQ6eB7d7chcI4g
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
	const [loading, setloading] = useState(false);
	const [photos, setphotos] = useState([]);
	const [page, setpage] = useState(1);
	const [query, setquery] = useState("");
	const [newImages, setnewImages] = useState(false);

	const mounted = useRef(false);

	const fetchImages = async () => {
		setloading(true);
		let url;
		const urlPage = `&page=${page}`;
		const urlQuery = `&query=${query}`;

		if (query) {
			url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
		} else {
			url = `${mainUrl}${clientID}${urlPage}`;
		}
		try {
			const resp = await fetch(url);
			const data = await resp.json();

			setphotos((oldPhoto) => {
				if (query && page === 1) {
					return data.results;
				} else if (query) {
					return [...oldPhoto, ...data.results];
				} else {
					return [...oldPhoto, ...data];
				}
			});
			setnewImages(false);
			setloading(false);
		} catch (error) {
			setloading(false);
			setnewImages(false);
			console.log(error);
		}
	};

	useEffect(() => {
		fetchImages();
		// eslint-disable-next-line
	}, [page]);

	useEffect(() => {
		if (!mounted.current) {
			mounted.current = true;
			return;
		}
		if (loading) return;
		if (!newImages) return;

		setpage((oldpage) => oldpage + 1);
	}, [newImages]);

	const event = () => {
		if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
			setnewImages(true);
		}
	};
	useEffect(() => {
		window.addEventListener("scroll", event);
		return () => window.removeEventListener("scroll", event);
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!query) return;
		if (page === 1) {
			fetchImages();
		}
		setpage(1);
	};
	return (
		<main>
			<section className="search">
				<form className="search-form">
					<input
						type="text"
						placeholder="search"
						className="form-input"
						value={query}
						onChange={(e) => {
							setquery(e.target.value);
						}}
					/>
					<button className="submit-btn" type="submit" onClick={handleSubmit}>
						<FaSearch />
					</button>
				</form>
			</section>
			<section className="photos">
				<div className="photos-center">
					{photos.map((photo, i) => {
						return <Photo key={i} {...photo} />;
					})}
				</div>
				{loading && <h2 className="loading"> Loading.....</h2>}
			</section>
		</main>
	);
}

export default App;
