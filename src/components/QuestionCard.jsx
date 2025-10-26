import React, { useRef, useState, useEffect } from "react";

const QuestionCard = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionNumber,
}) => {
  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-number">Question {questionNumber}</span>
        <span className="section-badge">Part {question.section}</span>
      </div>

      {/* 🧾 Optional Reading Passage */}
      {question.passage && (
        <div className="reading-passage">
          <h4 className="passage-title">{question.passage}</h4>
          <p className="passage-text">{question.passageText}</p>
        </div>
      )}

      <h3 className="question-text">{question.question}</h3>

      {question.audio && (
        <div
          style={{ display: "flex", justifyContent: "center", margin: "1em 0" }}
        >
          <CircularAudioPlayer
            key={question.id + (question.audio || "")}
            src={question.audio}
          />
        </div>
      )}

      <div className="options-container">
        {Array.isArray(question.options) ? (
          question.options.map((option) => (
            <label
              key={option.id}
              className={`option-label ${
                selectedAnswer === option.id ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.id}
                checked={selectedAnswer === option.id}
                onChange={() => onAnswerSelect(question.id, option.id)}
              />
              <span className="option-text">
                {option.id}) {option.text}
              </span>
            </label>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">
            No options available for this question.
          </p>
        )}
      </div>
    </div>
  );
};

// 🎵 Custom circular audio player (unchanged except cleanup)
function CircularAudioPlayer({ src }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress(audioRef.current.currentTime);
  };
  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const size = 80;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = duration ? progress / duration : 0;
  const offset = circumference * (1 - percent);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3b82f6"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.2s linear" }}
        />
      </svg>
      <button
        onClick={togglePlay}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "none",
          background: isPlaying ? "#f3f4f6" : "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          cursor: "pointer",
        }}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg width="18" height="18" viewBox="0 0 18 18">
            <rect x="3" y="3" width="4" height="12" rx="1.5" fill="#3b82f6" />
            <rect x="11" y="3" width="4" height="12" rx="1.5" fill="#3b82f6" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18">
            <polygon points="4,3 15,9 4,15" fill="#3b82f6" />
          </svg>
        )}
      </button>
      <audio
        ref={audioRef}
        src={src}
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        style={{ display: "none" }}
      />
    </div>
  );
}

export default QuestionCard;
