import { useEffect, useState } from "react";

const codeSnippets = [
  `const initializeStream = async () => {
  const video = document.querySelector('video');
  const source = video.addSourceBuffer('video/mp4');
  await source.appendBuffer(videoData);
  video.play();
}`,
  `function authenticateUser(email, password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return validateCredentials(email, hash);
}`,
  `class VideoPlayer {
  constructor(element) {
    this.element = element;
    this.hls = new Hls();
  }
  
  loadStream(url) {
    this.hls.loadSource(url);
    this.hls.attachMedia(this.element);
  }
}`,
  `const fetchCatalog = async (userType) => {
  const response = await fetch('/api/videos', {
    headers: { 'Authorization': token }
  });
  return response.json();
}`,
];

export const CodeAnimation = () => {
  const [displayedCode, setDisplayedCode] = useState("");
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    const snippet = codeSnippets[currentSnippet];
    
    if (currentChar < snippet.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode(snippet.slice(0, currentChar + 1));
        setCurrentChar(currentChar + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentChar(0);
        setDisplayedCode("");
        setCurrentSnippet((currentSnippet + 1) % codeSnippets.length);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [currentChar, currentSnippet]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <pre className="text-primary font-mono text-sm md:text-base p-8 leading-relaxed">
        <code>{displayedCode}</code>
        <span className="animate-pulse">|</span>
      </pre>
    </div>
  );
};
