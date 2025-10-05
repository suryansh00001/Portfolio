import { useState, useEffect } from "react";
import IdCard from "./idCard/IdCard";
import { Terminal } from "./terminal/components/Terminal";

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLaptopOrLarger, setIsLaptopOrLarger] = useState(window.innerWidth >= 1024);

  // Continuous time update for bottom status bar
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsLaptopOrLarger(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#000',
      color: '#00ff88',
      fontFamily: '"Courier New", "Lucida Console", "Monaco", "Consolas", "Liberation Mono", "DejaVu Sans Mono", monospace',
      border: '2px solid #00ff88',
      boxSizing: 'border-box',
    }}>
      {/* Main Content Area */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        borderBottom: '1px solid #00ff88',
      }}>
        {/* Left Panel (40% - 3D ID Card) - Hidden on mobile/tablet */}
        <div style={{
          width: isLaptopOrLarger ? '40%' : '0%',
          borderRight: isLaptopOrLarger ? '1px solid #00ff88' : 'none',
          display: isLaptopOrLarger ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: isLaptopOrLarger ? '20px' : '0px',
          transition: 'width 0.3s ease, opacity 0.3s ease',
          overflow: 'hidden',
        }}>
          <IdCard 
            firstName="Suryansh" 
            lastName="Garg" 
            userId="24064029" 
            batch="Tech Enthusiast" 
            batchId="24" 
            date="19/11/2006" 
            profilePicture="/images/mypic.jpg" 
          />
        </div>

        {/* Right Panel (60% on laptop, 100% on mobile/tablet - Terminal Portfolio Interface) */}
        <div style={{
          width: isLaptopOrLarger ? '60%' : '100%',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease',
        }}>
          <Terminal />
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div style={{
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isLaptopOrLarger ? 'space-between' : 'flex-end',
        padding: '0 20px',
        borderTop: '1px solid #00ff88',
        fontSize: '0.85rem',
        backgroundColor: 'rgba(0, 255, 136, 0.05)',
      }}>
        {/* Left: Interactive 3D Card Label - Only show on laptop+ screens */}
        {isLaptopOrLarger && (
          <div style={{
            color: '#00ff88',
            opacity: 0.8,
            textShadow: '0 0 8px #00ff88',
          }}>
            [Interactive 3D Card]
          </div>
        )}

        {/* Right: Timestamp */}
        <div style={{
          color: '#00ff88',
          opacity: 0.8,
          textShadow: '0 0 8px #00ff88',
        }}>
          {currentTime.toLocaleString()}
        </div>
      </div>
    </div>
  )
}
