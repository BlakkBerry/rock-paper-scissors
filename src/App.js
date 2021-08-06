import './App.css';
import {Switch, BrowserRouter as Router, Route} from 'react-router-dom'
import StartPage from "./components/StartPage/StartPage";
import LobbyPage from "./components/LobbyPage/LobbyPage";
import OfflineGamePage from "./components/GamePage/OfflineGamePage";
import {LoaderProvider} from "./context/LoaderContext";
import Loader from "./components/Loader/Loader";
import {OverlayProvider} from "./context/OverlayContext";
import {ConnectionProvider} from "./context/ConnectionContext";
import OnlineGamePage from "./components/GamePage/OnlineGamePage";
import Alert from "./components/Alert/Alert";
import {AlertProvider} from "./context/AlertContext";

function App() {
    return (
        <ConnectionProvider>
            <LoaderProvider>
                <AlertProvider>
                    <OverlayProvider>
                        <Loader/>
                        <Alert/>
                        <Router>
                            <Switch>
                                <Route path="/lobby/:id">
                                    <LobbyPage/>
                                </Route>

                                <Route path="/game/:id">
                                    <OnlineGamePage/>
                                </Route>

                                <Route path="/game">
                                    <OfflineGamePage/>
                                </Route>

                                <Route path="/">
                                    <StartPage/>
                                </Route>
                            </Switch>
                        </Router>
                    </OverlayProvider>
                </AlertProvider>
            </LoaderProvider>
        </ConnectionProvider>
    );
}

export default App;
