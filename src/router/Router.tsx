import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { paths } from "./path"
import PrivateRoute from './PrivateRoute';
import Home from "../pages/Home";
import Login from "../pages/SignIn";
import Register from "../pages/SignUp";
import Private from "../pages/Private";
import MovieDetail from "../pages/MovieDetail";

export default function AppRouter() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path={paths.LOGIN} element={<Login />} />
				<Route path={paths.REGISTER} element={<Register />} />
				<Route element={<PrivateRoute />}>
					<Route path="/private" element={<Private />} />
				</Route>
				<Route path="/movie/:id" element={<MovieDetail />} /> {/* Route cho MovieDetail */}
			</Routes>
		</Router>
	);
}