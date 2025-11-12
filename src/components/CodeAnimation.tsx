import { useEffect, useState } from "react";

const codeLines = [
  "const player = new VideoPlayer();",
  "async function loadVideo(url) {",
  "  const stream = await fetch(url);",
  "  return stream.blob();",
  "}",
  "function authenticate(user) {",
  "  const token = jwt.sign(user);",
  "  return token;",
  "}",
  "class HLSPlayer extends Player {",
  "  loadSource(url) {",
  "    this.hls.attachMedia(video);",
  "  }",
  "}",
  "const videoData = await fetchCatalog();",
  "if (user.authenticated) {",
  "  player.play();",
  "}",
  "const buffer = video.addSourceBuffer();",
  "await buffer.appendBuffer(data);",
  "response.json({ success: true });",
  "const hash = crypto.createHash('sha256');",
  "return validateCredentials(email);",
  "localStorage.setItem('user', JSON.stringify(data));",
  "const users = JSON.parse(localStorage.getItem('users'));",
];

interface FallingCode {
  id: number;
  text: string;
  x: number;
  y: number;
  speed: number;
  displayedText: string;
  currentChar: number;
}

export const CodeAnimation = () => {
  const [fallingCodes, setFallingCodes] = useState<FallingCode[]>([]);

  useEffect(() => {
    const createNewCode = () => {
      const newCode: FallingCode = {
        id: Date.now() + Math.random(),
        text: codeLines[Math.floor(Math.random() * codeLines.length)],
        x: Math.random() * 100,
        y: -10,
        speed: 0.5 + Math.random() * 1,
        displayedText: "",
        currentChar: 0,
      };
      setFallingCodes((prev) => [...prev.slice(-8), newCode]);
    };

    const interval = setInterval(createNewCode, 2000);
    createNewCode();
    createNewCode();
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animationFrame = setInterval(() => {
      setFallingCodes((prev) =>
        prev
          .map((code) => {
            const newY = code.y + code.speed;
            let newDisplayedText = code.displayedText;
            let newCurrentChar = code.currentChar;

            if (code.currentChar < code.text.length && newY > 5) {
              newDisplayedText = code.text.slice(0, code.currentChar + 1);
              newCurrentChar = code.currentChar + 1;
            }

            return {
              ...code,
              y: newY,
              displayedText: newDisplayedText,
              currentChar: newCurrentChar,
            };
          })
          .filter((code) => code.y < 110)
      );
    }, 50);

    return () => clearInterval(animationFrame);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {fallingCodes.map((code) => (
        <div
          key={code.id}
          className="absolute font-mono text-sm md:text-base text-primary whitespace-nowrap transition-opacity duration-1000"
          style={{
            left: `${code.x}%`,
            top: `${code.y}%`,
            opacity: code.y > 5 ? 1 : 0,
            textShadow: '0 0 10px hsl(var(--primary) / 0.5)',
          }}
        >
          <code className="font-semibold">{code.displayedText}</code>
          {code.currentChar < code.text.length && code.y > 5 && (
            <span className="animate-pulse text-primary">|</span>
          )}
        </div>
      ))}
    </div>
  );
};
