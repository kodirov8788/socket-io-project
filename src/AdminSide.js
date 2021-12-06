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
  const [click, setClick] = useState(false);

  const socket = io.connect(port);
  // console.log("socket", socket);

  const location = useLocation();
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callAccess, setCallAccess] = useState(true);
  // const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [locate, setLocate] = useState(false);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  // console.log("Locate", locate);

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
    navigator?.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    socket?.on("me", (id) => {
      setMe(id);
    });

    socket?.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data?.from);
      setName(data?.name);
      setCallerSignal(data?.signal);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locate]);

  useEffect(
    (id) => {
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
            name: name,
          });
        });
        peer?.on("stream", (stream) => {
          userVideo.current.srcObject = stream;
        });
        socket?.on("callAccepted", (signal) => {
          setCallAccepted(true);
          peer.signal(signal);
        });

        connectionRef.current = peer;
      }
    },
    [locate, me, name, stream]
  );
  // const callUser = (id) => {};
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
              onClick={() => {
                setClick(false);
              }}
            >
              <HiChevronDoubleLeft />
              Quit
            </Button>
            <div className="video">
              {callAccess ? (
                <video
                  playsInline
                  muted
                  ref={myVideo}
                  autoPlay
                  style={{ width: "90%", margin: "0 5%" }}
                />
              ) : (
                ""
              )}
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
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setCallAccess(!callAccess)}
            >
              {callAccess ? "Switch off" : "Switch on"}
            </Button>
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
        <div
          className="main__CamereBtn"
          onClick={() => {
            setClick(!click);
          }}
        >
          <FiCamera />
        </div>
      </div>
    </>
  );
}

export default AdminSide;
