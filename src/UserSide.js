/* eslint-disable no-unused-vars */
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
// import AssignmentIcon from "@material-ui/icons/Assignment";
import PhoneIcon from "@material-ui/icons/Phone";
import React, { useEffect, useRef, useState } from "react";
// import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./App.css";
import { Link, useLocation } from "react-router-dom";
const localhost = true;
const port = localhost
  ? "http://localhost:5000"
  : "https://socket-io-herokuhost.herokuapp.com/";
// socket.on("me") ;
// console.log("socket >>>>", socket);
// console.log("socket test>>>>", socket.on("me") !== "" && "yoq");
// const socket = io.connect("http://localhost:5000");
const socket = io.connect(port);

function UserSide() {
  const location = useLocation();
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  // const [receivingCall, setReceivingCall] = useState(false);
  // const [caller, setCaller] = useState("");
  // const [callerSignal, setCallerSignal] = useState();
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
    if (locate === true) {
      socket?.on("me", (id) => {
        setMe(id);
      });

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
          // myVideo.current.srcObject = stream;
        });

      // socket?.on("callUser", (data) => {
      //   setReceivingCall(true);
      //   setCaller(data?.from);
      //   setName(data?.name);
      //   setCallerSignal(data?.signal);
      // });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locate]);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    if (locate) {
      peer?.on("signal", (data) => {
        socket.emit("callUser", {
          userToCall: id,
          signalData: data,
          from: me,
          // name: name,
        });
      });
      peer?.on("stream", (stream) => {
        userVideo.current.srcObject = stream;
      });
      socket?.on("callAccepted", (signal) => {
        setCallAccepted(true);
        peer?.signal(signal);
      });
      connectionRef.current = peer;
    }
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    // peer.on("signal", (data) => {
    //   socket.emit("answerCall", { signal: data, to: caller });
    // });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    // peer.signal(callerSignal);
    // connectionRef.current = peer;
  };
  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };
  return (
    <>
      <h1 style={{ textAlign: "center", color: "#fff" }}>User Side</h1>
      <Link className="link" to="/">
        Main Page
      </Link>
      <div className="container">
        <div className="video-container">
          {/* <div className="video">
            {stream && callAccess ? (
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                style={{ width: "300px" }}
              />
            ) : (
              ""
            )}
          </div> */}
          <div className="video">
            {callAccepted && !callEnded ? (
              <>
                <h1>Guest Video</h1>
                <video
                  playsInline
                  ref={userVideo}
                  autoPlay
                  style={{ width: "300px" }}
                />
              </>
            ) : null}
          </div>
        </div>
        <div className="myId">
          {/* <TextField
            id="filled-basic"
            label="Name"
            variant="filled"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: "20px" }}
          /> */}
          {/* <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AssignmentIcon fontSize="large" />}
            >
              Copy ID
            </Button>
          </CopyToClipboard> */}

          <TextField
            id="filled-basic"
            label="ID to call"
            variant="filled"
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
          />
          <div className="call-button">
            {callAccepted && !callEnded ? (
              <Button variant="contained" color="secondary" onClick={leaveCall}>
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
        <div>
          {/* {!callAccepted ? (
            <div className="caller">
              <h1> is calling...</h1>
              <Button variant="contained" color="primary" onClick={answerCall}>
                Answer
              </Button>
            </div>
          ) : null} */}
        </div>
      </div>
    </>
  );
}

export default UserSide;
