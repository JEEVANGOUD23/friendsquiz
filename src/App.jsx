
import { useState } from "react";
import "./App.css";

const QUESTIONS = [
  { question: "What's my favourite colour?", options: ["❤️ Red", "💙 Blue", "🖤 Black", "💚 Green"] },
  { question: "What's my favourite food?", options: ["🍕 Pizza", "🍔 Burger", "🍜 Biryani", "🍝 Pasta"] },
  { question: "What's my dream destination?", options: ["🏖️ Maldives", "🗼 Paris", "🏔️ Switzerland", "🗾 Japan"] },
  { question: "What's my favourite season?", options: ["☀️ Summer", "🌧️ Rainy", "❄️ Winter", "🌸 Spring"] },
  { question: "What do I enjoy doing most?", options: ["🎬 Watching movies", "🎮 Gaming", "🎵 Listening to music", "✈️ Travelling"] },
  { question: "What's my favourite drink?", options: ["☕ Coffee", "🧋 Bubble tea", "🥤 Juice", "🍵 Tea"] },
  { question: "What's my personality like?", options: ["😎 Cool", "😂 Funny", "🤫 Quiet", "🥳 Energetic"] },
  { question: "What makes me happiest?", options: ["👯 Friends", "👨‍👩‍👧 Family", "🎁 Gifts", "🌍 Adventures"] },
  { question: "What's my favourite music style?", options: ["🎸 Rock", "🎤 Pop", "🎧 Hip-hop", "🎼 Melody"] },
  { question: "What's my ideal weekend?", options: ["🏠 Staying home", "🎉 Party", "🌄 Going out", "😴 Sleeping"] },
  { question: "What do I value most in friendship?", options: ["🤝 Loyalty", "😂 Humour", "💖 Care", "🔐 Trust"] },
  { question: "What's my favourite time of day?", options: ["🌅 Morning", "☀️ Afternoon", "🌇 Evening", "🌙 Night"] },
  { question: "Which describes me best?", options: ["🦁 Brave", "🦋 Creative", "🧠 Smart", "💗 Caring"] },
  { question: "What's my dream superpower?", options: ["🦸 Flying", "⏳ Time travel", "🫥 Invisibility", "🧠 Reading minds"] },
  { question: "How long have we been friends?", options: ["🌱 Recently", "📅 A few months", "🎂 A few years", "♾️ Forever"] },
];

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
    !Array.isArray(data.questions) ||
    data.questions.length !== 15 ||
    data.questions.some(
      (q) =>
        typeof q.question !== "string" ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        !Number.isInteger(q.answer) ||
        q.answer < 0 ||
        q.answer > 3
    )
  ) {
    return null;
  }

  return data;
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
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const quiz = sharedQuiz;
  const currentQuestion = quiz?.questions?.[questionIndex];

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
      questions: QUESTIONS.map((q, index) => ({
        question: q.question,
        options: q.options,
        answer: correctAnswers[index],
      })),
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
    if (!friendName.trim()) {
      alert("Please enter your name!");
      return;
    }

    setQuestionIndex(0);
    setAnswers([]);
    setResult(null);
    setPage("play");
  }

  function nextFriendQuestion(optionIndex) {
    const updated = [...answers];
    updated[questionIndex] = optionIndex;
    setAnswers(updated);

    if (questionIndex < quiz.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      return;
    }

    const score = quiz.questions.reduce(
      (total, q, index) =>
        total + (updated[index] === q.answer ? 1 : 0),
      0
    );

    setResult({
      creator: quiz.creator,
      friend: friendName.trim(),
      score,
      total: quiz.questions.length,
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
              <button
                key={option}
                className={`option-card ${
                  correctAnswers[questionIndex] === index ? "selected" : ""
                }`}
                onClick={() => chooseCorrect(index)}
              >
                {option}
                {correctAnswers[questionIndex] === index && (
                  <span className="selected-mark">✓</span>
                )}
              </button>
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

    if (!friendName.trim()) {
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

    return (
      <main className="app-shell">
        <section className="hero">
          <div className="brand">💗 FriendMatch</div>
          <p className="eyebrow">
            QUESTION {questionIndex + 1} OF {quiz.questions.length}
          </p>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${((questionIndex + 1) / quiz.questions.length) * 100}%`,
              }}
            />
          </div>

          <h1 className="question-title">{currentQuestion.question}</h1>
          <p className="description">
            What do you think {quiz.creator} would choose?
          </p>

          <div className="options-grid">
            {currentQuestion.options.map((option, index) => (
              <button
                key={option}
                className="option-card"
                onClick={() => nextFriendQuestion(index)}
              >
                {option}
              </button>
            ))}
          </div>
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
