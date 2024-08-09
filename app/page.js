"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [streamUrl, setStreamUrl] = useState("");
  const [movementCommandTimeout, setMovementCommandTimeout] = useState(null);
  const [currentMovement, setCurrentMovement] = useState(null);

  const [autoBallTracking, setAutoBallTracking] = useState(false);
  const [verticleAngle, setVerticleAngle] = useState(null);
  const [horizontalAngle, setHorizontalAngle] = useState(null);

  useEffect(() => {
    setStreamUrl("http://192.168.86.39:5000/video_feed");

    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowUp":
          handleMovementKeyDown("up");
          break;
        case "ArrowDown":
          handleMovementKeyDown("down");
          break;
        case "ArrowLeft":
          handleMovementKeyDown("left");
          break;
        case "ArrowRight":
          handleMovementKeyDown("right");
          break;
        case "Escape":
          sendCommand("estop");
          break;
        case "a":
          sendCommand("auto");
          setAutoBallTracking(!autoBallTracking);
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
          handleMovementKeyUp();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [movementCommandTimeout]);

  const sendCommand = async (direction) => {
    try {
      const response = await fetch(
        `http://192.168.86.39:5000/move/${direction}`
      );
      const data = await response.text();
      console.log(data);
    } catch (error) {
      console.error("Error sending command:", error);
    }
  };

  const sendCommand2 = async (direction) => {
    try {
      const response = await fetch(`http://192.168.86.39:5000/${direction}`);
      const data = await response.text();
      console.log(data);
    } catch (error) {
      console.error("Error sending command:", error);
    }
  };

  const handleMovementKeyDown = (direction) => {
    setCurrentMovement(direction);
    sendCommand(direction);
    setMovementCommandTimeout(setInterval(() => sendCommand(direction), 100));
  };

  const handleMovementKeyUp = () => {
    if (movementCommandTimeout) {
      clearInterval(movementCommandTimeout);
      setMovementCommandTimeout(null);
    }
    sendCommand("stop");
    setCurrentMovement(null);
  };

  const handleMovementMouseDown = (direction) => {
    handleMovementKeyDown(direction);
  };

  const handleMovementMouseUp = () => {
    handleMovementKeyUp();
  };

  const handleMovementMouseLeave = () => {
    handleMovementKeyUp();
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-4">Ball Tracking Control</h1>
      <div className="w-[640px] h-[480px] mb-4">
        <img
          src={streamUrl}
          alt="Camera Stream"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button
          onMouseDown={() => handleMovementMouseDown("up")}
          onMouseUp={handleMovementMouseUp}
          onMouseLeave={handleMovementMouseLeave}
          className="col-start-2 px-4 py-2 text-lg bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Forward
        </button>
        <button
          onMouseDown={() => handleMovementMouseDown("down")}
          onMouseUp={handleMovementMouseUp}
          onMouseLeave={handleMovementMouseLeave}
          className="col-start-2 px-4 py-2 text-lg bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back
        </button>
        <button
          onMouseDown={() => handleMovementMouseDown("left")}
          onMouseUp={handleMovementMouseUp}
          onMouseLeave={handleMovementMouseLeave}
          className="col-start-1 row-start-2 px-4 py-2 text-lg bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Left
        </button>
        <button
          onMouseDown={() => handleMovementMouseDown("right")}
          onMouseUp={handleMovementMouseUp}
          onMouseLeave={handleMovementMouseLeave}
          className="col-start-3 row-start-2 px-4 py-2 text-lg bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Right
        </button>
        <button
          onClick={() => sendCommand("estop")}
          className="col-start-3 row-start-1 px-4 py-2 text-lg bg-red-500 text-white rounded hover:bg-red-600"
        >
          E_STOP
        </button>
        <button
          onClick={() => {
            sendCommand("auto");
            setAutoBallTracking(!autoBallTracking);
          }}
          className={`col-start-1 row-start-1 px-4 py-2 text-lg transition-all duration-200 ${
            autoBallTracking ? "bg-green-500 hover:bg-red-500" : "bg-blue-500"
          } text-white rounded hover:bg-green-600`}
        >
          Auto Ball Tracking
        </button>
      </div>
      <input
        placeholder="change verticle camera angle"
        type="number"
        className="w-1/4 mt-4 p-2 border text-black"
        value={verticleAngle}
        onChange={(e) => setVerticleAngle(e.target.value)}
      />
      <input
        placeholder="change horizontal camera angle"
        type="number"
        className="w-1/4 mt-4 p-2 border text-black"
        value={horizontalAngle}
        onChange={(e) => setHorizontalAngle(e.target.value)}
      />
      <button
        onClick={() => {
          sendCommand2(`angle/${verticleAngle}/${horizontalAngle}`);
        }}
        className="px-4 py-2 mt-4 text-lg bg-blue-500 text-white rounded hover:bg-blue-600"
      ></button>
    </div>
  );
}
