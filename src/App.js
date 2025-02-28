import React, { useState, useEffect, useRef } from "react";
import "./tailwind-output.css";


const CountdownTimer = () => {
  const [seconds, setSeconds] = useState("");
  const [currentNumber, setCurrentNumber] = useState(null);
  const [counting, setCounting] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const koreanVoice = availableVoices.find((voice) => voice.lang === "ko-KR");
      if (koreanVoice) {
        setSpeechVoice(koreanVoice);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const [speechVoice, setSpeechVoice] = useState(null);

  const speakNumber = (num) => {
    if (!speechVoice) return;

    const speech = new SpeechSynthesisUtterance(num.toString());
    speech.voice = speechVoice;
    window.speechSynthesis.speak(speech);
  };

  const startCounting = () => {
    if (!seconds || parseInt(seconds, 10) <= 0) return;

    setCurrentNumber(null);
    setCounting(true);
    let count = 0;

    speakNumber("시작!");

    intervalRef.current = setInterval(() => {
      count += 1;
      setCurrentNumber(count);
      speakNumber(count);

      if (count >= parseInt(seconds, 10)) {
        clearInterval(intervalRef.current);
        setCounting(false);
      }
    }, 1000);
  };

  const stopCounting = () => {
    clearInterval(intervalRef.current);
    window.speechSynthesis.cancel();
    setCounting(false);
    setCurrentNumber(null);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80 text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">⏳ 카운트다운 타이머</h1>

        <input
          type="number"
          value={seconds}
          onChange={(e) => setSeconds(e.target.value)}
          placeholder="초를 입력하세요"
          className="w-full p-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={counting}
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={startCounting}
            disabled={counting || !seconds}
            className={`px-4 py-2 rounded-lg text-white font-bold transition ${
              counting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            시작
          </button>

          <button
            onClick={stopCounting}
            disabled={!counting}
            className={`px-4 py-2 rounded-lg text-white font-bold transition ${
              counting ? "bg-red-500 hover:bg-red-600" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            정지
          </button>
        </div>

        {currentNumber !== null && (
          <h2 className="text-4xl font-bold text-gray-800 mt-6 transition-all animate-pulse">
            {currentNumber}
          </h2>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;
