import './App.css';
import {Switch, BrowserRouter as Router, Route} from 'react-router-dom'
import StartPage from "./pages/StartPage/StartPage";
import LobbyPage from "./pages/LobbyPage/LobbyPage";
import GamePage from "./pages/GamePage/GamePage";
import {LoaderProvider} from "./context/LoaderContext";
import Loader from "./pages/Loader/Loader";
import {OverlayProvider} from "./context/OverlayContext";

function App() {
    return (
        <LoaderProvider>
            <OverlayProvider>
                <Loader/>
                <Router>
                    <Switch>
                        <Route path="/lobby/:id">
                            <LobbyPage/>
                        </Route>

                        <Route path="/game/:id">
                            <h1>gfsadas</h1>
                        </Route>

                        <Route path="/game">
                            <GamePage/>
                        </Route>

                        <Route path="/">
                            <StartPage/>
                        </Route>
                    </Switch>
                </Router>
            </OverlayProvider>
        </LoaderProvider>
    );
}

export default App;
