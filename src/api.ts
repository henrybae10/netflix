const API_KEY = "01df40c9e2cb05c147aa671504b9bf96";
const BASE_PATH = "https://api.themoviedb.org/3";

/*
/(home) 페이지에 Latest movies, Top Rated Movies 그리고 Upcoming Movies의 슬라이더를 추가해주세요.
/tv 페이지에 Latest Shows, Airing Today, Popular, Top Rated의 슬라이더를 추가해주세요.
/search 페이지에 검색한 movie와 tv의 결과가 담긴 슬라이더를 추가해주세요.
/movie/:id 페이지를 더욱 예쁘게 꾸며보세요.
/tv/:id 페이지를 추가해주세요.
*/

interface IMovie {
	id: number;
	backdrop_path: string;
	poster_path: string;
	title: string;
	overview: string;
}

interface ITv {
	id: number;
	backdrop_path: string;
	poster_path: string;
	name: string;
	overview: string;
}

export interface IGetMoviesResult {
	dates: {
		maximum: string;
		minimum: string;
	};
	page: number;
	results: IMovie[];
	total_pages: number;
	total_results: number;
}

export interface IGetTvResult {
	dates: {
		maximum: string;
		minimum: string;
	};
	page: number;
	results: ITv[];
	total_pages: number;
	total_results: number;
}

export function getMovies() {
	return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
		(response) => response.json()
	);
}

export function getTopRatedMovies() {
	return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
		(response) => response.json()
	);
}

export function getUpcomingMovies() {
	return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
		(response) => response.json()
	);
}

export function getLatestTv() {
	return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
		(response) => response.json()
	);
}

export function getAiringTodayTv() {
	return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
		(response) => response.json()
	);
}
export function getPopularTv() {
	return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then(
		(response) => response.json()
	);
}
export function getTopRatedTv() {
	return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
		(response) => response.json()
	);
}

export function searchTv(keyword: string) {
	return fetch(
		`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}`
	).then((response) => response.json());
}

export function searchMovie(keyword: string) {
	return fetch(
		`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`
	).then((response) => response.json());
}
