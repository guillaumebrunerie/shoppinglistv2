import { Link, useNavigate, useRouteError } from "react-router-dom";
import { getLastListId, unsetLastListId } from "../localLists";

const ErrorPage = () => {
	const error = useRouteError() as Error;
	console.error(error);

	const lastListId = getLastListId();

	const navigate = useNavigate();
	const onBack = () => {
		unsetLastListId();
		navigate("/");
	}

	return (
		<main className="errorPage">
			<h1>Something went wrong!</h1>
			<i>{error.message}</i>
			<br/>
			<br/>
			{lastListId && <Link to={`/lists/${lastListId}`}>Back to the last list of lists</Link>}
			<br/>
			<a onClick={onBack} href="#">Back to the main page</a>
		</main>
	)
}

export default ErrorPage;
