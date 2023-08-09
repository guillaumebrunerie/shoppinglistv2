import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { LangProvider } from './translation.tsx';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ConvexProvider client={convex}>
			<LangProvider>
				<App />
			</LangProvider>
		</ConvexProvider>
	</React.StrictMode>,
);
