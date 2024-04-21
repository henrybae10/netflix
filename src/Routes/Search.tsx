import { useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
	IGetMoviesResult,
	IGetTvResult,
	getMovies,
	getTopRatedMovies,
	getUpcomingMovies,
	searchMovie,
	searchTv,
} from "../api";
import styled from "styled-components";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { makeImagePath } from "../utils";
import { PathMatch, useNavigate, useMatch } from "react-router-dom";

function Search() {
	const location = useLocation();
	const keyword = new URLSearchParams(location.search).get("keyword");

	const { data, isLoading } = useQuery<IGetTvResult>({
		queryKey: ["tvs", "searched"],
		queryFn: () => searchTv(keyword!.toString()),
	});

	const { data: movieData, isLoading: movieLoading } =
		useQuery<IGetMoviesResult>({
			queryKey: ["movies", "searched"],
			queryFn: () => searchMovie(keyword!.toString()),
		});

	const navigate = useNavigate();
	const bigMovieMatch: PathMatch<string> | null =
		useMatch("/movies/:movieId");

	const bigTvMatch: PathMatch<string> | null = useMatch("/tv/:tvId");

	const { scrollY } = useViewportScroll();
	const [index, setIndex] = useState(0);
	const [leaving, setLeaving] = useState(false);
	const incraseIndex = () => {
		if (data) {
			if (leaving) return;
			toggleLeaving();
			const totalMovies = data.results.length - 1;
			const maxIndex = Math.floor(totalMovies / offset) - 1;
			setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
		}
	};
	const toggleLeaving = () => setLeaving((prev) => !prev);

	const onMovieBoxClicked = (movieId: number) => {
		navigate(`/movies/${movieId}`);
	};

	const onTvBoxClicked = (tvId: number) => {
		navigate(`/tv/${tvId}`);
	};

	const onOverlayClick = () => navigate("/");

	const clickedMovie =
		bigMovieMatch?.params.movieId &&
		movieData?.results.find(
			(movie) => movie.id === +bigMovieMatch.params.movieId!
		);

	const clickedTv =
		bigTvMatch?.params.tvId &&
		data?.results.find((tv) => tv.id === +bigTvMatch.params.tvId!);

	return (
		<Wrapper onClick={incraseIndex}>
			{isLoading || movieLoading ? (
				<Loader>Loading...</Loader>
			) : (
				<>
					<SearchingSection>
						<Slider>
							<AnimatePresence
								initial={false}
								onExitComplete={toggleLeaving}>
								<SectionTitle>- Searched Movie</SectionTitle>
								<Row
									variants={rowVariants}
									initial="hidden"
									animate="visible"
									exit="exit"
									transition={{ type: "tween", duration: 1 }}
									key={index}>
									{movieData?.results
										.slice(1)
										.slice(
											offset * index,
											offset * index + offset
										)
										.map((movie) => (
											<Box
												layoutId={movie.id + ""}
												key={movie.id}
												whileHover="hover"
												initial="normal"
												variants={boxVariants}
												onClick={() =>
													onMovieBoxClicked(movie.id)
												}
												transition={{ type: "tween" }}
												bgPhoto={makeImagePath(
													movie.backdrop_path,
													"w500"
												)}>
												<Info variants={infoVariants}>
													<h4>{movie.title}</h4>
												</Info>
											</Box>
										))}
								</Row>
							</AnimatePresence>
						</Slider>
					</SearchingSection>
					<SearchingSection>
						<Slider>
							<AnimatePresence
								initial={false}
								onExitComplete={toggleLeaving}>
								<SectionTitle>- Searched Tv</SectionTitle>
								<Row
									variants={rowVariants}
									initial="hidden"
									animate="visible"
									exit="exit"
									transition={{ type: "tween", duration: 1 }}
									key={index}>
									{data?.results
										.slice(1)
										.slice(
											offset * index,
											offset * index + offset
										)
										.map((tv) => (
											<Box
												layoutId={tv.id + ""}
												key={tv.id}
												whileHover="hover"
												initial="normal"
												variants={boxVariants}
												onClick={() =>
													onTvBoxClicked(tv.id)
												}
												transition={{ type: "tween" }}
												bgPhoto={makeImagePath(
													tv.backdrop_path,
													"w500"
												)}>
												<Info variants={infoVariants}>
													<h4>{tv.name}</h4>
												</Info>
											</Box>
										))}
								</Row>
							</AnimatePresence>
						</Slider>
					</SearchingSection>
					<AnimatePresence>
						{bigMovieMatch ? (
							<>
								<Overlay
									onClick={onOverlayClick}
									exit={{ opacity: 0 }}
									animate={{ opacity: 1 }}
								/>
								<BigContents
									style={{ top: scrollY.get() + 100 }}
									layoutId={bigMovieMatch.params.movieId}>
									{clickedMovie && (
										<>
											<BigCover
												style={{
													backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
														clickedMovie.backdrop_path,
														"w500"
													)})`,
												}}
											/>
											<BigTitle>
												{clickedMovie.title}
											</BigTitle>
											<BigOverview>
												{clickedMovie.overview}
											</BigOverview>
										</>
									)}
								</BigContents>
							</>
						) : bigTvMatch ? (
							<>
								<Overlay
									onClick={onOverlayClick}
									exit={{ opacity: 0 }}
									animate={{ opacity: 1 }}
								/>
								<BigContents
									style={{ top: scrollY.get() + 100 }}
									layoutId={bigTvMatch.params.movieId}>
									{clickedTv && (
										<>
											<BigCover
												style={{
													backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
														clickedTv.backdrop_path,
														"w500"
													)})`,
												}}
											/>
											<BigTitle>
												{clickedTv.name}
											</BigTitle>
											<BigOverview>
												{clickedTv.overview}
											</BigOverview>
										</>
									)}
								</BigContents>
							</>
						) : null}
					</AnimatePresence>
				</>
			)}
		</Wrapper>
	);
}

const Wrapper = styled.div`
	background: black;
	padding-top: 200px;
	padding-bottom: 200px;
`;

const Loader = styled.div`
	height: 20vh;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Title = styled.h2`
	font-size: 68px;
	margin-bottom: 20px;
`;

const Overview = styled.p`
	font-size: 30px;
	width: 50%;
`;

const SearchingSection = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 300px;
`;

const Slider = styled.div`
	position: relative;
	top: -100px;
`;

const Row = styled(motion.div)`
	display: grid;
	gap: 5px;
	grid-template-columns: repeat(6, 1fr);
	position: absolute;
	width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
	background-color: white;
	background-image: url(${(props) => props.bgPhoto});
	background-size: cover;
	background-position: center center;
	height: 200px;
	font-size: 66px;
	cursor: pointer;
	&:first-child {
		transform-origin: center left;
	}
	&:last-child {
		transform-origin: center right;
	}
`;

const Info = styled(motion.div)`
	padding: 10px;
	background-color: ${(props) => props.theme.black.lighter};
	opacity: 0;
	position: absolute;
	width: 100%;
	bottom: 0;
	h4 {
		text-align: center;
		font-size: 18px;
	}
`;

const Overlay = styled(motion.div)`
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	opacity: 0;
`;

const BigContents = styled(motion.div)`
	position: absolute;
	width: 40vw;
	height: 80vh;
	left: 0;
	right: 0;
	margin: 0 auto;
	border-radius: 15px;
	overflow: hidden;
	background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
	width: 100%;
	background-size: cover;
	background-position: center center;
	height: 400px;
`;

const BigTitle = styled.h3`
	color: ${(props) => props.theme.white.lighter};
	padding: 20px;
	font-size: 46px;
	position: relative;
	top: -80px;
`;

const BigOverview = styled.p`
	padding: 20px;
	position: relative;
	top: -80px;
	color: ${(props) => props.theme.white.lighter};
`;

const SectionTitle = styled.h3`
	margin: 10px;
	color: ${(props) => props.theme.white.lighter};
	font-size: 30px;
`;

const rowVariants = {
	hidden: {
		x: window.outerWidth + 5,
	},
	visible: {
		x: 0,
	},
	exit: {
		x: -window.outerWidth - 5,
	},
};

const boxVariants = {
	normal: {
		scale: 1,
	},
	hover: {
		scale: 1.3,
		y: -80,
		transition: {
			delay: 0.5,
			duaration: 0.1,
			type: "tween",
		},
	},
};

const infoVariants = {
	hover: {
		opacity: 1,
		transition: {
			delay: 0.5,
			duaration: 0.1,
			type: "tween",
		},
	},
};

const offset = 6;

export default Search;
