import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { ConvexProvider, ConvexReactClient } from "convex/react";

import './index.css'
import { LangProvider } from './translation.tsx';
import MainPage, { loader as rootLoader } from './MainPage.tsx';
import ListPage from './ListPage.tsx';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const router = createBrowserRouter(createRoutesFromElements(
	<Route
		// errorElement={<ErrorPage/>}
	>
		<Route
			path="/"
			element={<MainPage/>}
			loader={rootLoader}
		/>
		<Route
			path="/lists/:listId"
			element={<ListPage/>}
		/>
		<Route
			// path="/lists/:listId/recentlyDeleted"
			// element={<RecentlyDeletedPage/>}
		/>
	</Route>
));

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ConvexProvider client={convex}>
			<LangProvider>
				<RouterProvider router={router}/>
			</LangProvider>
		</ConvexProvider>
	</React.StrictMode>,
);
