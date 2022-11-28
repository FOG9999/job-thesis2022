import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import WaitingRoom from "../WaitingRoom/WaitingRoom"
import { useDispatch, useSelector } from "react-redux"
import { getGame } from "../../../actions/game"
import { getQuiz } from "../../../actions/quiz"
import {
  getLeaderboard,
  updateQuestionLeaderboard,
  updateCurrentLeaderboard,
} from "../../../actions/leaderboard"
import styles from "./hostScreen.module.css"
import Question from "../Question/Question"
import useInterval from 'use-interval';

function HostScreen() {
  const socket = useSelector((state) => state.socket.socket)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [isPreviewScreen, setIsPreviewScreen] = useState(false)
  const [isQuestionScreen, setIsQuestionScreen] = useState(false)
  const [isQuestionResultScreen, setIsQuestionResultScreen] = useState(false)
  const [isLeaderboardScreen, setIsLeaderboardScreen] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timer, setTimer] = useState(0)
  const [playerList, setPlayerList] = useState([])
  const [questionData, setQuestionData] = useState({
    questionType: "Quiz",
    pointType: "Standard",
    answerTime: 5,
    backgroundImage: "",
    question: "",
    answerList: [
      { name: "a", body: "", isCorrect: false },
      { name: "b", body: "", isCorrect: false },
      { name: "c", body: "", isCorrect: false },
      { name: "d", body: "", isCorrect: false },
    ],
    questionIndex: 1,
  })
  const dispatch = useDispatch()
  const { id } = useParams()
  const { game } = useSelector((state) => state.games)
  const { quiz } = useSelector((state) => state.quiz)
  const { leaderboard } = useSelector((state) => state.leaderboards)
  const isLanguageEnglish = useSelector((state) => state.language.isEnglish)
  const [questionResult, setQuestionResult] = useState(
    leaderboard?.questionLeaderboard[0]
  )
  const [currentLeaderboard, setCurrentLeaderboard] = useState(
    leaderboard?.currentLeaderboard[0]
  )
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  const [indexQuestionCountDown, setIndexQuestionCountDown] = useState(0);

  useEffect(() => {
    dispatch(getGame(id))
  }, [id, dispatch])

  useEffect(() => {
    if (game) {
      dispatch(getQuiz(game.quizId))
    }
  }, [dispatch, game])

  useEffect(() => {
    setTimer(5)
  }, [])

  useEffect(() => {
    socket.on("get-answer-from-player", (data, id, score, player) => {
      updateLeaderboard(data, id, score)
      let playerData = { id: data.playerId, userName: player.userName }
      setPlayerList((prevstate) => [...prevstate, playerData])
      console.log('received')
    })
    socket.on('leave-game', () => {
      socket.emit('all-leave')
    })
  }, [socket])

  useEffect(() => {
    if(isGameStarted && timer <= 0 && playerList.length == numberOfPlayers){
      displayQuestionResult(currentQuestionIndex);
    }
  }, [playerList]);

  const updateLeaderboard = async (data, id, score) => {
    let question = await dispatch(updateQuestionLeaderboard(data, id))
    setQuestionResult(question.questionLeaderboard[data.questionIndex - 1])
    let leaderboardData = {
      questionIndex: data.questionIndex,
      playerId: data.playerId,
      playerCurrentScore: score,
    }
    let leaderboard = await dispatch(
      updateCurrentLeaderboard(leaderboardData, id)
    )
    setCurrentLeaderboard(
      leaderboard.currentLeaderboard[data.questionIndex - 1]
    )
  }

  const startGame = () => {
    socket.emit("start-game", quiz)
    socket.emit("question-preview", () => {
      startPreviewCountdown(5, currentQuestionIndex)
    })
    setIsGameStarted((prevstate) => !prevstate)
    setIsPreviewScreen(true)
  }

  useEffect(() => {
    console.log('currentQuestionIndex', currentQuestionIndex)
  }, [currentQuestionIndex])

  const startPreviewCountdown = (seconds, index) => {
    setIsLeaderboardScreen(false)
    setIsPreviewScreen(true)
    let time = seconds
    let interval = setInterval(() => {
      setTimer(time)
      if (time === 0) {
        clearInterval(interval)
        displayQuestion(index)
        setIsPreviewScreen(false)
        setIsQuestionScreen(true)
      }
      time--
    }, 1000)
  }

  const startQuestionCountdown = (seconds, index) => {
    let time = seconds
    // let interval = setInterval(() => {
    //   setTimer(time)
    //   if (time === 0) {
    //     clearInterval(interval)
    //     // nếu số người chơi > số người chơi đã gửi đáp án -> đòi đáp án từ những người chơi còn lại
    //     // họ sẽ gửi đáp án sai để bắt buộc cập nhật
    //     forceAnswer(index);
    //   }
    //   time--
    // }, 1000)
    setTimer(time)
    setIndexQuestionCountDown(index);
  }
  useInterval(() => {
    let time = timer - 1;
    if(timer === 0 && isQuestionScreen){
      forceAnswer(indexQuestionCountDown);
    }
    setTimer(time);
  }, (timer >= 0 && isGameStarted) ? 1000 : null);
  const forceAnswer = (index) => {
    if(playerList.length < numberOfPlayers){
      console.log('give me your answers...')
      socket.emit('force-answer', {currentQuestionIndex: currentQuestionIndex});
    }
    else displayQuestionResult(index)
  }
  const displayQuestionResult = (index) => {
    setIsQuestionScreen(false)
    setIsQuestionResultScreen(true)
    setTimeout(() => {
      displayCurrentLeaderBoard(index)
    }, 5000)
  }

  const increaseNumberOfPlayers = () => {
    setNumberOfPlayers(numberOfPlayers+1);
  }

  const displayCurrentLeaderBoard = (index) => {
    setIsQuestionResultScreen(false)
    setIsLeaderboardScreen(true)
    setTimeout(() => {
      console.log(currentQuestionIndex, quiz.questionList.length)
      if (currentQuestionIndex < quiz.questionList.length) {
        socket.emit("question-preview", () => {
          startPreviewCountdown(5, index)
          setPlayerList([])
        })
      }
      else {
        // the end
        socket.emit('game-end');
      }
    }, 5000)
  }

  const displayQuestion = (index) => {
    if (index === quiz.questionList.length) {
      displayCurrentLeaderBoard(index)
    } else {
      setQuestionData(quiz.questionList[index])
      setCurrentQuestionIndex((prevstate) => prevstate + 1)
      let time = quiz.questionList[index].answerTime
      let question = {
        answerList: quiz.questionList[index].answerList,
        questionIndex: quiz.questionList[index].questionIndex,
        correctAnswersCount: quiz.questionList[index].answerList.filter(
          (answer) => answer.isCorrect === true
        ).length,
      }
      socket.emit("start-question-timer", time, question, () => {
        startQuestionCountdown(time, index + 1)
      })
    }
  }
  // console.log(playerList)
  return (
    <div className={styles.page}>
      {!isGameStarted && (
        <div className={styles.lobby}>
          <WaitingRoom pin={game?.pin} socket={socket} increaseNumberOfPlayers={increaseNumberOfPlayers} />
          <button onClick={startGame}>
            {isLanguageEnglish ? "Start a game" : "Bắt đầu"}
          </button>
        </div>
      )}

      {isPreviewScreen && (
        <div className={styles["question-preview"]}>
          <h1>{timer < 0 ? 0 : timer}</h1>
        </div>
      )}
      {isQuestionScreen && (
        <div className={styles["question-preview"]}>
          <Question
            key={questionData.questionIndex}
            question={questionData}
            timer={timer}
            host={true}
          />
        </div>
      )}
      {isQuestionResultScreen && (
        <div className={styles["question-preview"]}>
          <div className={styles["leaderboard"]}>
            <h1 className={styles["leaderboard-title"]}>
              {isLanguageEnglish ? "Question result" : "Kết quả câu hỏi"}
            </h1>
            <ol>
              {questionResult.questionResultList.map((player) => (
                <li>
                  {playerList
                    .filter((x) => x.id === player.playerId)
                    .map((x) => (
                      <mark>{x.userName}</mark>
                    ))}
                  <small>{player.playerPoints}</small>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
      {isLeaderboardScreen && (
        <div className={styles["question-preview"]}>
          <div className={styles["leaderboard"]}>
            <h1 className={styles["leaderboard-title"]}>
              {isLanguageEnglish ? "Leaderboard" : "Bảng xếp hạng"}
            </h1>
            <ol>
              {currentLeaderboard.leaderboardList.map((player) => (
                <li>
                  {playerList
                    .filter((x) => x.id === player.playerId)
                    .map((x) => (
                      <mark>{x.userName}</mark>
                    ))}
                  <small>{player.playerCurrentScore}</small>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}

export default HostScreen
