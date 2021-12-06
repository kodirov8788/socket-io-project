/* eslint-disable react-hooks/exhaustive-deps */
import Button from "@material-ui/core/Button";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { FiCamera } from "react-icons/fi";
import { HiChevronDoubleLeft } from "react-icons/hi";
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./App.css";
import { Link, useLocation } from "react-router-dom";
const localhost = false;
const port = localhost
  ? "http://localhost:5000"
  : "https://socket-io-herokuhost.herokuapp.com/";

function AdminSide() {
  const socket = io.connect(port);
  // console.log("socket", socket);
  const [click, setClick] = useState(false);

  const location = useLocation();
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  // const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  // const [name, setName] = useState("");
  const [locate, setLocate] = useState(false);
  // const myVideo = useRef();
  // const userVideo = useRef();
  const connectionRef = useRef();

  console.log("click >>>", click);

  console.log("me >>>", me);
  // console.log("me >>>", customId);
  // console.log("name >>>", name);
  // console.log("caller >>>", caller);
  // console.log("receivingCall >>>", receivingCall);
  // console.log("callerSignal >>>", callerSignal);
  // console.log("callAccess", callAccess);
  // console.log("stream", stream);
  // console.log("myVideo", myVideo);
  // console.log("userVideo", userVideo);
  useEffect(() => {
    if (location.pathname === "/adminside") {
      setLocate(true);
    }
  }, [location]);
  useEffect(() => {
    // navigator?.mediaDevices
    //   .getUserMedia({ video: true, audio: true })
    //   .then((stream) => {
    //     setStream(stream);
    //     myVideo.current.srcObject = stream;
    //   });
    socket?.on("me", (id) => {
      setMe(id);
    });
    click &&
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
          // myVideo.current.srcObject = stream;
        });

    socket?.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data?.from);
      // setName(data?.name);
      setCallerSignal(data?.signal);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locate, click]);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    // peer.on("stream", (stream) => {
    //   userVideo.current.srcObject = stream;
    // });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };
  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  const OpenSidebar = () => {
    setClick(true);
  };
  const CloseSidebar = () => {
    setClick(false);
    stream.getTracks().forEach((track) => {
      track.stop();
    });
    !callEnded && setCallEnded(true);
  };

  return (
    <>
      <h1 style={{ textAlign: "center", color: "#fff" }}>Admin Side</h1>
      <Link className="link" to="/">
        Main Page
      </Link>
      <div className="container">
        <div className="video-container"></div>
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
              {/* {callAccess ? (
                <video
                  playsInline
                  muted
                  ref={myVideo}
                  autoPlay
                  style={{ width: "90%", margin: "0 5%" }}
                />
              ) : (
                ""
              )} */}
            </div>
          </div>

          <div className="buttons">
            <CopyToClipboard text={me}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AssignmentIcon fontSize="large" />}
              >
                Copy ID
              </Button>
            </CopyToClipboard>

            <div className="call-button">
              {callAccepted && !callEnded && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={leaveCall}
                >
                  End Call
                </Button>
              )}
            </div>
          </div>
        </div>
        <div>
          {receivingCall && !callAccepted ? (
            <div className="caller">
              <h1> is calling...</h1>
              <Button variant="contained" color="primary" onClick={answerCall}>
                Answer
              </Button>
            </div>
          ) : null}
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
    </>
  );
}

export default AdminSide;
