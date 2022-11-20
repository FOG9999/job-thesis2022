import React, { useEffect } from "react"
import Navbar from "./components/Navbar/Navbar"
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom"
import Home from "./components/Home/Home"
import Auth from "./components/Auth/Auth"
import Footer from "./components/Footer/Footer"
import QuizCreator from "./components/QuizCreator/QuizCreator"
import Quizes from "./components/Quizes/Quizes"
import MyQuizes from "./components/MyQuizes/MyQuizes"
import QuizDetails from "./components/QuizDetails/QuizDetails"
import HostScreen from "./components/Game/HostScreen/HostScreen"
import PlayerScreen from "./components/Game/PlayerScreen/PlayerScreen"
import JoinGame from "./components/Game/JoinGame/JoinGame"
import UserDetail from "./components/UserDetail/UserDetail.jsx"
import { io } from "socket.io-client"
import { useDispatch, useSelector } from "react-redux"
import { createSocket } from "./actions/socket"
import { Alert } from "@material-ui/lab"
import AlertCommon from "./components/Alert/AlertCommon"
import ConfirmCommon from "./components/Alert/ConfirmCommon"
import Administrator from "./components/Administrator/Administrator"

function App() {
  let user = useSelector(state => state.auth.authData)
  const dispatch = useDispatch()
  let alertState = useSelector(state => state.alert);
  let confirmState = useSelector(state => state.confirm);

  useEffect(() => {
    const socket = io("http://localhost:3001")
    dispatch(createSocket(socket))

    return () => socket.disconnect()
  }, [dispatch])

  return (
    <BrowserRouter>
      <Navbar />
      {alertState.isShow ? <AlertCommon message={alertState.message} type={alertState.type} isOpen={alertState.isShow} /> : <></>}
      {confirmState.isShow ? <ConfirmCommon message={confirmState.message} callback={confirmState.callback} isOpen={confirmState.isShow} params={confirmState.params} /> : <></>}
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/auth" exact component={() => (user === null ? <Auth /> : <Redirect to="/" />)} />
        <Route path="/quizes" exact component={Quizes} />
        <Route path="/quizes/search" exact component={Quizes} />
        <Route path="/quizes/:id" exact component={QuizDetails} />
        <Route path="/myquizes/:id" exact component={QuizCreator} />
        <Route path="/games/joingame" exact component={JoinGame} />
        <Route path="/games/host/:id" exact component={HostScreen} />
        <Route path="/games/player/:id" exact component={PlayerScreen} />
        <Route path="/myquizes" exact component={MyQuizes} />
        <Route path="/userdetail" exact component={UserDetail} />
        <Route path="/admin" exact component={Administrator} />
      </Switch>
      <Footer />
    </BrowserRouter>
  )
}

export default App
