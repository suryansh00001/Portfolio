import { useState, useEffect, useRef, useCallback } from "react";
import { commands } from "../data/commands";

export const Terminal = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Array<{type: 'command' | 'output', content: string}>>([
    { type: 'command', content: 'welcome' },
    { type: 'output', content: "Hi, I'm Suryansh Garg, a Sophomore at IIT BHU.\n\nWelcome to my interactive portfolio terminal!\nType 'help' to see available commands." }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showCursor, setShowCursor] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (terminalRef.current) {
      setTimeout(() => {
        terminalRef.current?.scrollTo({
          top: terminalRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [history]);

  // Focus input when terminal is clicked
  useEffect(() => {
    const handleClick = () => {
      inputRef.current?.focus();
    };
    const terminal = terminalRef.current;
    terminal?.addEventListener('click', handleClick);
    return () => terminal?.removeEventListener('click', handleClick);
  }, []);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);



  const handleCommand = useCallback((cmd: string) => {
    const command = cmd.toLowerCase().trim();
    
    if (command === "clear") {
      setHistory([]);
      setInput("");
      return;
    }
    
    if (command === "") {
      setHistory(prev => [...prev, { type: 'command', content: '' }]);
      setInput("");
      return;
    }

    const output = commands[command as keyof typeof commands] || `Command not found: ${command}. Type 'help' for available commands.`;
    
    setHistory(prev => [
      ...prev, 
      { type: 'command', content: cmd },
      { type: 'output', content: output }
    ]);
    setCommandHistory(prev => {
      const newHistory = [command, ...prev.filter(h => h !== command)];
      return newHistory.slice(0, 50);
    });
    setHistoryIndex(-1);
    setInput("");
  }, []);

  const getAutoComplete = useCallback((partial: string) => {
    if (!partial) return [];
    const commandList = Object.keys(commands);
    return commandList.filter(cmd => cmd.startsWith(partial.toLowerCase()));
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        handleCommand(input);
        break;
      
      case "ArrowUp":
        e.preventDefault();
        if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
        break;
      
      case "ArrowDown":
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setInput("");
        }
        break;
      
      case "Tab":
        e.preventDefault();
        const suggestions = getAutoComplete(input);
        if (suggestions.length === 1) {
          setInput(suggestions[0]);
        }
        break;
    }
  };

  const handleCommandClick = (cmd: string) => {
    if (cmd !== 'clear') {
      handleCommand(cmd);
    } else {
      setHistory([]);
    }
  };

  const formatOutput = (text: string) => {
    return text.split('\n').map((line, index) => (
      <div key={index}>
        {line.includes('Suryansh Garg') ? (
          <>
            Hi, I'm <strong style={{ color: '#00ff88' }}>Suryansh Garg</strong>, a Software & AI Engineer.
          </>
        ) : (
          line
        )}
      </div>
    ));
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <div style={{
        borderBottom: '1px solid #00ff88',
        paddingBottom: '8px',
        marginBottom: '12px',
        color: '#00ff88',
        fontSize: '0.9rem',
        letterSpacing: '0.5px',
        fontFamily: '"Courier New", "Lucida Console", "Monaco", "Consolas", "Liberation Mono", "DejaVu Sans Mono", monospace',
      }}>
        {Object.keys(commands).map((cmd, index) => (
          <span key={cmd}>
            <span 
              style={{ 
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#00ffaa'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#00ff88'}
              onClick={() => handleCommandClick(cmd)}
            >
              {cmd}
            </span>
            {index < Object.keys(commands).length - 1 && ' | '}
          </span>
        ))}
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          fontSize: '1rem',
          lineHeight: '1.6',
          marginBottom: '12px',
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE and Edge */
          maxHeight: 'calc(100vh - 160px)', /* Prevent breaking */
          minHeight: '200px',
          paddingRight: '10px', /* Space for content */
          fontFamily: '"Courier New", "Lucida Console", "Monaco", "Consolas", "Liberation Mono", "DejaVu Sans Mono", monospace',
        }}
      >
        {history.map((item, i) => (
          <div key={i} style={{ 
            marginBottom: '8px',
            fontFamily: '"Courier New", "Lucida Console", "Monaco", "Consolas", "Liberation Mono", "DejaVu Sans Mono", monospace'
          }}>
            {item.type === 'command' ? (
              <div>
                <span style={{ color: '#4fa3ff' }}>suryansh@portfolio</span>
                <span style={{ color: '#00ff88' }}>:~$</span>
                <span style={{ color: '#ffffff' }}> {item.content}</span>
              </div>
            ) : (
              <div style={{ color: '#ffffff', marginLeft: '0px' }}>
                {formatOutput(item.content)}
              </div>
            )}
          </div>
        ))}
        
        {/* Current Input */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          position: 'sticky',
          bottom: '0',
          backgroundColor: '#000',
          paddingTop: '8px',
          borderTop: '1px solid rgba(0, 255, 136, 0.2)',
          marginTop: '8px',
          fontFamily: '"Courier New", "Lucida Console", "Monaco", "Consolas", "Liberation Mono", "DejaVu Sans Mono", monospace'
        }}>
          <span style={{ color: '#4fa3ff' }}>suryansh@portfolio</span>
          <span style={{ color: '#00ff88' }}>:~$</span>
          <span style={{ color: '#ffffff' }}> </span>
          <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <input
              ref={inputRef}
              style={{
                background: 'transparent',
                outline: 'none',
                color: '#ffffff',
                border: 'none',
                caretColor: 'transparent',
                fontFamily: '"Courier New", "Lucida Console", "Monaco", "Consolas", "Liberation Mono", "DejaVu Sans Mono", monospace',
                fontSize: 'inherit',
                width: '100%',
                minWidth: 0,
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
            />
            <span
              style={{
                position: 'absolute',
                top: '0',
                left: `${Math.min(input.length * 0.6, 30)}em`, /* Limit cursor position */
                color: '#00ff88',
                opacity: showCursor ? 1 : 0,
                animation: 'blink 1s step-end infinite',
                textShadow: '0 0 8px #00ff88',
                pointerEvents: 'none',
              }}
            >
              ▊
            </span>
          </div>
        </div>
      </div>

    </>
  );
};