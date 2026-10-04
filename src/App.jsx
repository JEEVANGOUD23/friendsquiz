import { useState } from "react";

import "./App.css";



// Each option has a label and an emoji (fallback).

// If `image` is set AND the file loads, a photo is shown instead of the emoji.

// Put the photos in the project's  public/options/  folder.

const img = (name) => `/options/${name}.jpg`;



const QUESTIONS = [

  {

    question: "What's my favourite colour?",

    options: [

      { label: "Red", emoji: "❤️", image: img("red") },

      { label: "Blue", emoji: "💙", image: img("blue") },

      { label: "Black", emoji: "🖤", image: img("black") },

      { label: "Green", emoji: "💚", image: img("green") },

    ],

  },

  {

    question: "What's my favourite food?",

    options: [

      { label: "Pizza", emoji: "🍕", image: img("pizza") },

      { label: "Burger", emoji: "🍔", image: img("burger") },

      { label: "Biryani", emoji: "🍜", image: img("biryani") },

      { label: "Pasta", emoji: "🍝", image: img("pasta") },

    ],

  },

  {

    question: "What's my dream destination?",

    options: [

      { label: "Maldives", emoji: "🏖️", image: img("maldives") },

      { label: "Paris", emoji: "🗼", image: img("paris") },

      { label: "Switzerland", emoji: "🏔️", image: img("switzerland") },

      { label: "Japan", emoji: "🗾", image: img("japan") },

    ],

  },

  {

    question: "What's my favourite season?",

    options: [

      { label: "Summer", emoji: "☀️", image: img("summer") },

      { label: "Rainy", emoji: "🌧️", image: img("rainy") },

      { label: "Winter", emoji: "❄️", image: img("winter") },

      { label: "Spring", emoji: "🌸", image: img("spring") },

    ],

  },

  {

    question: "What do I enjoy doing most?",

    options: [

      { label: "Watching movies", emoji: "🎬", image: img("movies") },

      { label: "Gaming", emoji: "🎮", image: img("gaming") },

      { label: "Listening to music", emoji: "🎵", image: img("listening-music") },

      { label: "Travelling", emoji: "✈️", image: img("travelling") },

    ],

  },

  {

    question: "What's my favourite drink?",

    options: [

      { label: "Coffee", emoji: "☕", image: img("coffee") },

      { label: "Bubble tea", emoji: "🧋", image: img("bubble-tea") },

      { label: "Juice", emoji: "🥤", image: img("juice") },

      { label: "Tea", emoji: "🍵", image: img("tea") },

    ],

  },

  {

    question: "What's my personality like?",

    options: [

      { label: "Cool", emoji: "😎" },

      { label: "Funny", emoji: "😂" },

      { label: "Quiet", emoji: "🤫" },

      { label: "Energetic", emoji: "🥳" },

    ],

  },

  {

    question: "What makes me happiest?",

    options: [

      { label: "Friends", emoji: "👯", image: img("friends") },

      { label: "Family", emoji: "👨‍👩‍👧", image: img("family") },

      { label: "Gifts", emoji: "🎁", image: img("gifts") },

      { label: "Adventures", emoji: "🌍", image: img("adventures") },

    ],

  },

  {

    question: "What's my favourite music style?",

    options: [

      { label: "Rock", emoji: "🎸", image: img("rock") },

      { label: "Pop", emoji: "🎤", image: img("pop") },

      { label: "Hip-hop", emoji: "🎧", image: img("hiphop") },

      { label: "Melody", emoji: "🎼", image: img("melody") },

    ],

  },

  {

    question: "What's my ideal weekend?",

    options: [

      { label: "Staying home", emoji: "🏠", image: img("staying-home") },

      { label: "Party", emoji: "🎉", image: img("party") },

      { label: "Going out", emoji: "🌄", image: img("going-out") },

      { label: "Sleeping", emoji: "😴", image: img("sleeping") },

    ],

  },

  {

    question: "What do I value most in friendship?",

    options: [

      { label: "Loyalty", emoji: "🤝" },

      { label: "Humour", emoji: "😂" },

      { label: "Care", emoji: "💖" },

      { label: "Trust", emoji: "🔐" },

    ],

  },

  {

    question: "What's my favourite time of day?",

    options: [

      { label: "Morning", emoji: "🌅", image: img("morning") },

      { label: "Afternoon", emoji: "☀️", image: img("afternoon") },

      { label: "Evening", emoji: "🌇", image: img("evening") },

      { label: "Night", emoji: "🌙", image: img("night") },

    ],

  },

  {

    question: "Which describes me best?",

    options: [

      { label: "Brave", emoji: "🦁" },

      { label: "Creative", emoji: "🦋" },

      { label: "Smart", emoji: "🧠" },

      { label: "Caring", emoji: "💗" },

    ],

  },

  {

    question: "What's my dream superpower?",

    options: [

      { label: "Flying", emoji: "🦸" },

      { label: "Time travel", emoji: "⏳" },

      { label: "Invisibility", emoji: "🫥" },

      { label: "Reading minds", emoji: "🧠" },

    ],

  },

  {

    question: "How long have we been friends?",

    options: [

      { label: "Recently", emoji: "🌱" },

      { label: "A few months", emoji: "📅" },

      { label: "A few years", emoji: "🎂" },

      { label: "Forever", emoji: "♾️" },

    ],

  },

];



// The quiz link now only stores the creator's name and their answers.

// Questions and photos come from the code above, so links stay short.

function encodeQuiz(data) {

  const bytes = new TextEncoder().encode(JSON.stringify(data));

  let binary = "";

  bytes.forEach((byte) => {

    binary += String.fromCharCode(byte);

  });



  return btoa(binary)

    .replace(/\+/g, "-")

    .replace(/\//g, "_")

    .replace(/=+$/, "");

}



function decodeQuiz(value) {

  try {

    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");

    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    const binary = atob(padded);

    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

    return JSON.parse(new TextDecoder().decode(bytes));

  } catch {

    return null;

  }

}



function readSharedQuiz() {

  const encoded = new URLSearchParams(window.location.search).get("quiz");

  if (!encoded) return null;



  const data = decodeQuiz(encoded);



  if (

    !data ||

    typeof data.creator !== "string" ||

    !Array.isArray(data.answers) ||

    data.answers.length !== QUESTIONS.length ||

    data.answers.some((a) => !Number.isInteger(a) || a < 0 || a > 3)

  ) {

    return null;

  }



  return data;

}



// One answer card: shows a photo if available, otherwise the emoji.

function OptionCard({ option, selected, onClick }) {

  const [imageFailed, setImageFailed] = useState(false);

  const showImage = option.image && !imageFailed;



  return (

    <button

      className={`option-card ${showImage ? "has-image" : ""} ${

        selected ? "selected" : ""

      }`}

      onClick={onClick}

    >

      {showImage ? (

        <img

          src={option.image}

          alt={option.label}

          loading="lazy"

          onError={() => setImageFailed(true)}

        />

      ) : (

        <span className="option-emoji">{option.emoji}</span>

      )}

      <span className="option-label">{option.label}</span>

      {selected && <span className="selected-mark">✓</span>}

    </button>

  );

}



export default function App() {

  const [sharedQuiz] = useState(() => readSharedQuiz());

  const [page, setPage] = useState(() =>

    readSharedQuiz() ? "play" : "home"

  );



  const [creatorName, setCreatorName] = useState("");

  const [friendName, setFriendName] = useState("");

  const [questionIndex, setQuestionIndex] = useState(0);

  const [correctAnswers, setCorrectAnswers] = useState([]);

  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [result, setResult] = useState(null);

  const [copied, setCopied] = useState(false);



  const quiz = sharedQuiz;



  function startCreating() {

    if (!creatorName.trim()) {

      alert("Please enter your name first!");

      return;

    }



    setQuestionIndex(0);

    setCorrectAnswers([]);

    setPage("setup");

  }



  function chooseCorrect(optionIndex) {

    setCorrectAnswers((previous) => {

      const updated = [...previous];

      updated[questionIndex] = optionIndex;

      return updated;

    });

  }



  function nextSetupQuestion() {

    if (correctAnswers[questionIndex] === undefined) {

      alert("Please select your answer!");

      return;

    }



    if (questionIndex < QUESTIONS.length - 1) {

      setQuestionIndex((previous) => previous + 1);

    } else {

      setQuestionIndex(0);

      setPage("ready");

    }

  }



  function makeShareLink() {

    if (sharedQuiz) {

      return window.location.href;

    }



    const data = {

      creator: creatorName.trim(),

      answers: correctAnswers,

    };



    return `${window.location.origin}${window.location.pathname}?quiz=${encodeQuiz(data)}`;

  }



  async function copyLink() {

    const link = makeShareLink();



    try {

      await navigator.clipboard.writeText(link);

      setCopied(true);

      window.setTimeout(() => setCopied(false), 2000);

    } catch {

      window.prompt("Copy your quiz link:", link);

    }

  }



  // Short WhatsApp messages

  function shareOnWhatsApp() {

    const link = makeShareLink();



    const message = result

      ? `💖 I scored ${result.score}/${result.total} on ${result.creator}'s quiz! Can you beat me? 👀👇\n${link}`

      : `💖 Hey bestie! Take my quiz and see how well you know me! 👀💕\n\nPlay now 👇\n${link}`;



    window.open(

      `https://wa.me/?text=${encodeURIComponent(message)}`,

      "_blank",

      "noopener,noreferrer"

    );

  }



  function startFriendQuiz() {
  const name = friendName.trim();

  if (name.length < 2) {
    alert("Please enter your name using at least 2 characters!");
    return;
  }

  setFriendName(name);
  setQuestionIndex(0);
  setAnswers([]);
  setSelectedAnswer(null);
  setResult(null);
  setFriendQuizStarted(true);
}

  function chooseFriendAnswer(optionIndex) {
    setSelectedAnswer(optionIndex);
  }

  function nextFriendQuestion() {
    if (selectedAnswer === null) {
      alert("Please select an answer first!");
      return;
    }
    const updated = [...answers];
    updated[questionIndex] = selectedAnswer;
    setAnswers(updated);

    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex((previous) => previous + 1);
      setSelectedAnswer(null);
      return;
    }

    const score = quiz.answers.reduce(
      (total, correct, index) => total + (updated[index] === correct ? 1 : 0),
      0
    );
    setResult({
      creator: quiz.creator,
      friend: friendName.trim(),
      score,
      total: QUESTIONS.length,
    });
    setPage("result");
  }

  function restart() {

    window.location.href = window.location.pathname;

  }



  if (page === "home") {

    return (

      <main className="app-shell">

        <section className="hero">

          <div className="brand">💗 FriendMatch</div>

          <div className="hero-emoji">👯‍♀️</div>

          <p className="eyebrow">THE FRIENDSHIP CHALLENGE</p>

          <h1>

            How well do your

            <br />

            <span>friends know you?</span>

          </h1>

          <p className="description">

            Create your personal quiz, share it with your besties, and

            discover who really knows you!

          </p>



          <label className="field-label" htmlFor="creator-name">

            YOUR NAME

          </label>

          <input

            id="creator-name"

            className="name-input"

            placeholder="Enter your name..."

            value={creatorName}

            onChange={(e) => setCreatorName(e.target.value)}

            onKeyDown={(e) => e.key === "Enter" && startCreating()}

          />



          <button className="primary-btn" onClick={startCreating}>

            Create my quiz 💖

          </button>

          <p className="small-note">

            15 questions · 4 choices · Lots of fun

          </p>

        </section>

      </main>

    );

  }



  if (page === "setup") {

    const q = QUESTIONS[questionIndex];



    return (

      <main className="app-shell">

        <section className="hero">

          <div className="brand">💗 FriendMatch</div>

          <p className="eyebrow">

            QUESTION {questionIndex + 1} OF {QUESTIONS.length}

          </p>



          <div className="progress-track">

            <div

              className="progress-fill"

              style={{

                width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%`,

              }}

            />

          </div>



          <h1 className="question-title">{q.question}</h1>

          <p className="description">

            Choose the answer that describes you best.

          </p>



          <div className="options-grid">

            {q.options.map((option, index) => (

              <OptionCard

                key={option.label}

                option={option}

                selected={correctAnswers[questionIndex] === index}

                onClick={() => chooseCorrect(index)}

              />

            ))}

          </div>



          <button className="primary-btn" onClick={nextSetupQuestion}>

            {questionIndex === QUESTIONS.length - 1

              ? "Create my quiz 🎉"

              : "Next question →"}

          </button>

        </section>

      </main>

    );

  }



  if (page === "ready") {

    return (

      <main className="app-shell">

        <section className="hero ready-panel">

          <div className="result-heart">💗</div>

          <p className="eyebrow">YOUR QUIZ IS READY</p>

          <h1>

            Time to test

            <br />

            <span>your friendships!</span>

          </h1>

          <p className="description">

            Share your quiz link with friends. They'll answer 15 questions

            and find out how well they know you.

          </p>



          <button className="primary-btn" onClick={copyLink}>

            {copied ? "✓ Link copied!" : "🔗 Copy my quiz link"}

          </button>



          <button className="whatsapp-btn" onClick={shareOnWhatsApp}>

            💚 Share on WhatsApp

          </button>



          <button

            className="secondary-btn"

            onClick={() => {

              setQuestionIndex(0);

              setPage("setup");

            }}

          >

            ✏️ Edit my answers

          </button>



          <p className="small-note">

            Anyone with your link can take the quiz.

          </p>

        </section>

      </main>

    );

  }



  if (page === "play") {

    if (!quiz) {

      return (

        <main className="app-shell">

          <section className="hero">

            <h1>Quiz link unavailable 😕</h1>

            <p className="description">

              This link may be invalid. Ask your friend to create a new quiz.

            </p>

            <button className="primary-btn" onClick={restart}>

              Create my own quiz

            </button>

          </section>

        </main>

      );

    }



    if (!friendQuizStarted) {

      return (

        <main className="app-shell">

          <section className="hero">

            <div className="brand">💗 FriendMatch</div>

            <div className="hero-emoji">🫶</div>

            <p className="eyebrow">FRIENDSHIP CHALLENGE</p>

            <h1>

              How well do you

              <br />

              <span>know {quiz.creator}?</span>

            </h1>

            <p className="description">

              Answer 15 questions and see how well you know your friend!

            </p>



            <label className="field-label" htmlFor="friend-name">

              YOUR NAME

            </label>

            <input

              id="friend-name"

              className="name-input"

              placeholder="Enter your name..."

              value={friendName}

              onChange={(e) => setFriendName(e.target.value)}

              onKeyDown={(e) => e.key === "Enter" && startFriendQuiz()}

            />



            <button className="primary-btn" onClick={startFriendQuiz}>

              Start the quiz 💖

            </button>

          </section>

        </main>

      );

    }



    const currentQuestion = QUESTIONS[questionIndex];



    return (

      <main className="app-shell">

        <section className="hero">

          <div className="brand">💗 FriendMatch</div>

          <p className="eyebrow">

            QUESTION {questionIndex + 1} OF {QUESTIONS.length}

          </p>



          <div className="progress-track">

            <div

              className="progress-fill"

              style={{

                width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%`,

              }}

            />

          </div>



          <h1 className="question-title">{currentQuestion.question}</h1>

          <p className="description">

            What do you think {quiz.creator} would choose?

          </p>



          <div className="options-grid">

            {currentQuestion.options.map((option, index) => (

              <OptionCard

                key={option.label}

                option={option}

                selected={selectedAnswer === index}
                onClick={() => chooseFriendAnswer(index)}

              />

            ))}

          </div>

          <button
            className="primary-btn"
            onClick={nextFriendQuestion}
            disabled={selectedAnswer === null}
          >
            {questionIndex === QUESTIONS.length - 1
              ? "See my result 💖"
              : "Next question →"}
          </button>

        </section>

      </main>

    );

  }



  if (page === "result" && result) {

    return (

      <main className="app-shell">

        <section className="hero result-panel">

          <div className="result-heart">💗</div>

          <p className="eyebrow">FRIENDSHIP RESULTS</p>

          <h1>

            {result.friend}, you know

            <br />

            <span>{result.creator}...</span>

          </h1>



          <div className="score-circle">

            <strong>

              {result.score}/{result.total}

            </strong>

            <span>correct answers</span>

          </div>



          <h2 className="result-message">

            {result.score === result.total

              ? "Perfect match! You know them so well! 🏆"

              : result.score >= 11

              ? "Bestie level unlocked! 💖"

              : result.score >= 7

              ? "Good friends! Keep learning about each other 🫶"

              : "Time to make more memories together! 💕"}

          </h2>



          <button className="whatsapp-btn" onClick={shareOnWhatsApp}>

            💚 Share results on WhatsApp

          </button>



          <button className="primary-btn" onClick={copyLink}>

            {copied ? "✓ Link copied!" : "🔗 Copy quiz link"}

          </button>



          <button className="secondary-btn" onClick={restart}>

            ✨ Create your own quiz

          </button>

        </section>

      </main>

    );

  }



  return null;

}
