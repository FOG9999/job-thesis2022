import React from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addAnswer, getPlayerResult } from "../../../actions/playerResult"
import { useEffect } from "react"
import styles from "./playerScreen.module.css"
import Answer from "../Answer/Answer"
import diamond from "../../../assets/diamond.svg"
import triangle from "../../../assets/triangle.svg"
import circle from "../../../assets/circle.svg"
import square from "../../../assets/square.svg"
import { CircularProgress } from "@material-ui/core"
import useInterval from "use-interval";

function PlayerScreen() {
  const socket = useSelector((state) => state.socket.socket)
  const isLanguageEnglish = useSelector((state) => state.language.isEnglish)
  const dispatch = useDispatch()
  const { playerResult } = useSelector((state) => state.playerResults)
  const [result, setResult] = useState(playerResult?.answers[0])

  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false)
  const [isPreviewScreen, setIsPreviewScreen] = useState(false)
  const [isQuestionScreen, setIsQuestionScreen] = useState(false)
  const [isResultScreen, setIsResultScreen] = useState(false)
  const [timer, setTimer] = useState(0)
  const [answerTime, setAnswerTime] = useState(0)
  const [questionData, setQuestionData] = useState()
  const [correctAnswerCount, setCorrectAnswerCount] = useState(1)
  const [isStartQuestionCountDown, setIsStartQuestionCountDown] = useState(false);

  const [answer, setAnswer] = useState({
    questionIndex: 0,
    answers: [],
    time: 0,
  })

  useEffect(() => {
    setTimer(5)
  }, [])

  useEffect(() => {
    console.log('playerResult: ', playerResult);
  }, [playerResult])

  useEffect(() => {
    socket.on("host-start-preview", () => {
      setIsPreviewScreen(true)
      setIsResultScreen(false)
      startPreviewCountdown(5)
    })
    socket.on("host-start-question-timer", (time, question) => {
      console.log(question)
      setQuestionData(question.answerList)
      startQuestionCountdown(time)
      setAnswer((prevstate) => ({
        ...prevstate,
        questionIndex: question.questionIndex,
        answers: [],
        time: 0,
      }))
      setCorrectAnswerCount(question.correctAnswersCount)
    })
    socket.on('give-answer-now', ({ currentQuestionIndex, numberOfCorrectAnswer }) => {
      if (answer.answers.length == 0) {
        console.log('giving default wrong answer...')
        const defaultWrongAnswer = {
          questionIndex: currentQuestionIndex,
          answers: [],
          time: 0,
        }
        console.log('defaultWrongAnswer: ', defaultWrongAnswer)
        for(let i=1; i<=numberOfCorrectAnswer; i++){
          defaultWrongAnswer.answers.push(i.toString())
        }
        setAnswer((prevstate) => ({
          ...prevstate,
          ...defaultWrongAnswer
        }))
      }
    })
    socket.on('leave-game', () => {
      socket.emit('all-leave')
      console.log('player leaving...')
      socket.removeAllListeners("host-start-preview");
      socket.removeAllListeners("host-start-question-timer");
      socket.removeAllListeners("give-answer-now");
      socket.removeAllListeners("leave-game");
    })
  }, [socket])

  const startPreviewCountdown = (seconds) => {
    let time = seconds
    setIsStartQuestionCountDown(false);
    let interval = setInterval(() => {
      setTimer(time)
      if (time === 0) {
        clearInterval(interval)
        setIsPreviewScreen(false)
        setIsQuestionScreen(true)
      }
      time--
    }, 1000)
  }

  const startQuestionCountdown = (seconds) => {
    let time = seconds
    let answerSeconds = 0
    // let interval = setInterval(() => {
    //   setTimer(time)
    //   setAnswerTime(answerSeconds)
    //   if (time === 0) {
    //     console.log('timeout!')
    //     clearInterval(interval)

    //     if(isQuestionAnswered){          
    //       setIsQuestionScreen(false)
    //       setIsQuestionAnswered(false)
    //       setIsResultScreen(true)
    //     }
    //     else console.log('didnt answer')
    //   }
    //   time--
    //   answerSeconds++
    // }, 1000)
    setIsStartQuestionCountDown(true);
    setAnswerTime(answerSeconds);
    setTimer(time);
  }

  useInterval(() => {
    let time = timer - 1;
    if (timer == 0) {
      console.log('timeout!')
      console.log('timeout and answers.length is: ', answer.answers.length)
      if (answer.answers.length > 0) {
        setIsQuestionScreen(false)
        setIsQuestionAnswered(false)
        setIsResultScreen(true)
      }
      else console.log('didnt answer')
    }
    setTimer(time);
    setAnswerTime(answerTime + 1);
  }, timer >= 0 && isStartQuestionCountDown ? timer : null)

  const sendAnswer = async () => {
    const updatedPlayerResult = await dispatch(
      addAnswer(answer, playerResult._id)
    )
    // console.log(
    //   updatedPlayerResult.answers[updatedPlayerResult.answers.length - 1]
    // )
    setResult(
      updatedPlayerResult.answers[updatedPlayerResult.answers.length - 1]
    )
    let data = {
      questionIndex: answer.questionIndex,
      playerId: updatedPlayerResult.playerId,
      playerPoints:
        updatedPlayerResult.answers[updatedPlayerResult.answers.length - 1].points,
      // vì một số câu hỏi trước có thể k trả lời nên index trong anwers khác với questionIndex
      // => chọn câu trả lời cuối cùng được insert
    }
    let score = updatedPlayerResult.score
    socket.emit("send-answer-to-host", data, score)
    dispatch(getPlayerResult(playerResult._id))
    console.log('answer sent and isQuestionAnswer is: ', isQuestionAnswered)
    if (timer < 0) {
      setIsQuestionScreen(false)
      setIsQuestionAnswered(false)
      setIsResultScreen(true)
    }
  }

  const checkAnswer = (name) => {
    let answerIndex = answer.answers.findIndex((obj) => obj === name)
    if (answer.answers.includes(name)) {
      //remove answer
      setAnswer((prevstate) => ({
        ...prevstate,
        time: answerTime,
        answers: [
          ...prevstate.answers.slice(0, answerIndex),
          ...prevstate.answers.slice(answerIndex + 1, prevstate.answers.length),
        ],
      }))
    } else {
      //add answer
      setAnswer((prevstate) => ({
        ...prevstate,
        time: answerTime,
        answers: [...prevstate.answers, name],
      }))
    }
    // setAnswer((prevstate) => ({
    //   ...prevstate,
    //   time: answerTime,
    // }))
  }

  useEffect(() => {
    console.log(answer)
    if (
      answer?.answers.length > 0 &&
      answer?.answers.length === correctAnswerCount
    ) {
      setIsQuestionScreen(false)
      setIsQuestionAnswered(true)
      console.log('sending answer...')
      sendAnswer()
    } else {
      setIsQuestionAnswered(false)
    }
  }, [answer?.answers.length, correctAnswerCount, answer, socket])

  return (
    <div className={styles.page}>
      {isPreviewScreen && (
        <div className={styles["question-preview"]}>
          <h1>{timer >= 0 ? timer : 0}</h1>
        </div>
      )}
      {isQuestionScreen && (
        <div className={styles["question-preview"]}>
          <div className={styles["answers-container"]}>
            <Answer
              icon={triangle}
              showText={false}
              isAnswerClicked={answer.answers.includes("a")}
              onClick={() => checkAnswer("a")}
            />
            <Answer
              icon={diamond}
              showText={false}
              isAnswerClicked={answer.answers.includes("b")}
              onClick={() => checkAnswer("b")}
            />
            {questionData?.length > 2 && (
              <>
                <Answer
                  icon={circle}
                  showText={false}
                  isAnswerClicked={answer.answers.includes("c")}
                  onClick={() => checkAnswer("c")}
                />
                <Answer
                  icon={square}
                  showText={false}
                  isAnswerClicked={answer.answers.includes("d")}
                  onClick={() => checkAnswer("d")}
                />
              </>
            )}
          </div>
        </div>
      )}
      {isQuestionAnswered && (
        <div className={styles["question-preview"]}>
          <h1>{isLanguageEnglish ? "Wait for a result" : "Chờ kết quả"}</h1>
          <CircularProgress />
        </div>
      )}
      {isResultScreen && (
        <div
          className={styles["question-preview"]}
          style={{ backgroundColor: result && result.points > 0 ? "green" : "red" }}
        >
          <h1>{isLanguageEnglish ? "Result" : "Kết quả"}</h1>
          <h3>
            {result && result.points > 0
              ? isLanguageEnglish
                ? "Correct"
                : "Đúng"
              : isLanguageEnglish
                ? "Wrong"
                : "Sai"}
          </h3>
          <h3>
            {isLanguageEnglish ? "Points: " : "Điểm số: "} {result && result.points ? result.points : 0}
          </h3>
        </div>
      )}
    </div>
  )
}

export default PlayerScreen
