/* eslint-disable no-unused-vars */
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
// import AssignmentIcon from "@material-ui/icons/Assignment";
import PhoneIcon from "@material-ui/icons/Phone";
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import { FiCamera } from "react-icons/fi";
import { HiChevronDoubleLeft } from "react-icons/hi";
import io from "socket.io-client";
import "./App.css";
import { Link, useLocation } from "react-router-dom";
const localhost = false;
const port = localhost
  ? "http://localhost:5000"
  : "https://socket-io-herokuhost.herokuapp.com/";

function UserSide() {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const socket2 = io.connect(port);
    setSocket(socket2);
  }, []);
  console.log("socket", socket);

  const [click, setClick] = useState(false);
  const location = useLocation();
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callAccess, setCallAccess] = useState(true);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  // const [name, setName] = useState("");

  const [locate, setLocate] = useState(false);
  // const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  // console.log("Locate", locate);

  console.log("me >>>", me);
  // console.log("name >>>", name);
  // console.log("caller >>>", caller);
  // console.log("receivingCall >>>", receivingCall);
  // console.log("callerSignal >>>", callerSignal);
  // console.log("callAccepted", callAccepted);
  // console.log("callAccess", callAccess);
  // console.log("stream", stream);
  // console.log("myVideo", myVideo);
  // console.log("userVideo", userVideo);

  useEffect(() => {
    if (location.pathname === "/userside") {
      setLocate(true);
    }
  }, [location]);
  useEffect(() => {
    if (locate) {
      socket?.on("me", (id) => {
        setMe(id);
      });

      if (click) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            setStream(stream);
            // myVideo.current.srcObject = stream;
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locate, click]);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    if (locate) {
      peer.on("signal", (data) => {
        socket.emit("callUser", {
          userToCall: id,
          signalData: data,
          from: me,
          // name: name,
        });
      });
      peer.on("stream", (stream) => {
        userVideo.current.srcObject = stream;
      });
      socket.on("callAccepted", (signal) => {
        setCallAccepted(true);
        peer.signal(signal);
      });
      connectionRef.current = peer;
    }
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };
  const OpenSidebar = () => {
    if (click === false) {
      setClick(true);
    } else {
      setClick(false);
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };
  const CloseSidebar = () => {
    setClick(false);
    stream.getTracks().forEach((track) => {
      track.stop();
    });
    setCallEnded(true);
  };
  return (
    <>
      <h1 style={{ textAlign: "center", color: "#fff" }}>User Side</h1>
      <Link className="link" to="/">
        Main Page
      </Link>
      <div className="container">
        <div className="video-container"></div>
        <div className="main__container">
          <div className={`myId ${click && "hover"}`}>
            <div className="video__container">
              <Button
                variant="contained"
                color="secondary"
                onClick={CloseSidebar}
              >
                <HiChevronDoubleLeft />
                Quit
              </Button>
              <div className="video">
                {callAccepted && !callEnded ? (
                  <video
                    playsInline
                    ref={userVideo}
                    autoPlay
                    style={{ width: "90%", margin: "0 5%" }}
                  />
                ) : null}
              </div>
            </div>

            <div className="buttons">
              <TextField
                id="filled-basic"
                label="ID to call"
                variant="filled"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
              />
              <div className="call-button">
                {callAccepted && !callEnded ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={leaveCall}
                  >
                    End Call
                  </Button>
                ) : (
                  <IconButton
                    color="primary"
                    aria-label="call"
                    onClick={() => callUser(idToCall)}
                  >
                    <PhoneIcon fontSize="large" />
                  </IconButton>
                )}
                {/* {idToCall} */}
              </div>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setCallAccess(!callAccess)}
              >
                {callAccess ? "Switch off" : "Switch on"}
              </Button>
            </div>
          </div>
          {click ? (
            <div className="main__userCamereBtn" onClick={CloseSidebar}>
              <FiCamera />
            </div>
          ) : (
            <div className="main__userCamereBtn" onClick={OpenSidebar}>
              <FiCamera />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserSide;
