import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
import Header from "./Components/Header";

function Router() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/search" element={<Search />} />
				<Route path="/tv" element={<Tv />} />
				<Route path="tv/:id" element={<Tv />} />
				<Route path="/" element={<Home />} />
				<Route path="movies/:id" element={<Home />} />
			</Routes>
		</BrowserRouter>
	);
}

export default Router;
