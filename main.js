import './style.css';

import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = 
{
    apiKey: "AIzaSyBjgasE-mpCCPapVU6csMDCxGA0bCDzuUw",
    authDomain: "cs553-dcc51.firebaseapp.com",
    projectId: "cs553-dcc51",
    storageBucket: "cs553-dcc51.appspot.com",
    messagingSenderId: "195541698192",
    appId: "1:195541698192:web:7120b77c32e5c35e647a15",
    measurementId: "G-C3LBY38X6K"
};

if (!firebase.apps.length)
{
  firebase.initializeApp(firebaseConfig);
}

// Firestore object
const firestore = firebase.firestore();

// STUN servers used
const servers = 
{
  iceServers: 
  [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

// Set up peer connection and stream variables
const peerConnection = new RTCPeerConnection(servers);
let localStream = null;
let remoteStream = null;

// Get HTML objects
const webcamButton = document.getElementById('webcamButton');
const webcamVideo = document.getElementById('webcamVideo');
const videoButtonOn = document.getElementById('videoButtonOn');
const videoButtonOff = document.getElementById('videoButtonOff');
const audioButtonOn = document.getElementById('audioButtonOn');
const audioButtonOff = document.getElementById('audioButtonOff');
const callButton = document.getElementById('callButton');
const callInput = document.getElementById('callInput');
const callCode = document.getElementById('callCode');
const answerButton = document.getElementById('answerButton');
const remoteVideo = document.getElementById('remoteVideo');
const hangupButton = document.getElementById('hangupButton');

// Initial setup for video and microphone resources
webcamButton.onclick = async () =>
{
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  remoteStream = new MediaStream();

  // console.log(localStream)
  // Add local stream to peer connection
  localStream.getTracks().forEach((track) =>
  {
    peerConnection.addTrack(track, localStream);
  });

  // Set video stream from remote stream
  peerConnection.ontrack = (event) =>
  {
    event.streams[0].getTracks().forEach((track) =>
    {
      remoteStream.addTrack(track);
    });
  };

  webcamVideo.srcObject = localStream;
  remoteVideo.srcObject = remoteStream;

  callButton.disabled = false;
  answerButton.disabled = false;
  videoButtonOff.disabled = false;
  audioButtonOff.disabled = false;
  callCode.disabled = false;
  callInput.disabled = false;

  webcamButton.disabled = true;
};

// Functionality to handle camera on/off and audio mute/unmute
videoButtonOn.onclick = async() =>
{
  // localStream = await navigator.mediaDevices.getUserMedia({ video: true });
  webcamVideo.srcObject = localStream;

  videoButtonOff.disabled = false;
  videoButtonOn.disabled = true;
}

videoButtonOff.onclick = async() =>
{
  // localStream.getVideoTracks().forEach((track) =>
  // {
  //   peerConnection.removeTrack(track);
  // });

  // localStream.muted = true;
  webcamVideo.srcObject = null;

  peerConnection.enabled = false;
  // // Add local stream to peer connection
  // localStream.getTracks().forEach((track) =>
  // {
  //   peerConnection.removeTrack(track);
  // });

  // // Set video stream from remote stream
  // peerConnection.ontrack = (event) =>
  // {
  //   event.streams[0].getTracks().forEach((track) =>
  //   {
  //     remoteStream.addTrack(track);
  //   });
  // };

  videoButtonOn.disabled = false;
  videoButtonOff.disabled = true;
}

audioButtonOn.onclick = async() =>
{
  audioButtonOff.disabled = false;
  audioButtonOn.disabled = true;
}

audioButtonOff.onclick = async() =>
{
  
  audioButtonOn.disabled = false;
  audioButtonOff.disabled = true;
}


// Creating an offer
callButton.onclick = async () =>
{
  // Firestore collections used for facilitating signaling
  const callDoc = firestore.collection('calls').doc();
  const offerCandidates = callDoc.collection('offerCandidates');
  const answerCandidates = callDoc.collection('answerCandidates');

  callCode.value = callDoc.id;

  // Save to database - candidates for call
  peerConnection.onicecandidate = (event) =>
  {
    event.candidate && offerCandidates.add(event.candidate.toJSON());
  };

  // Creating offer for call
  const offerDescription = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offerDescription);

  const offer =
  {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };

  await callDoc.set({ offer });

  // Listening for remote answer
  callDoc.onSnapshot((snapshot) => {
    const data = snapshot.data();
    if (!peerConnection.currentRemoteDescription && data?.answer)
    {
      const answerDescription = new RTCSessionDescription(data.answer);
      peerConnection.setRemoteDescription(answerDescription);
    }
  });

  // Adding canditate to the connection when call is answered
  answerCandidates.onSnapshot((snapshot) =>
  {
    snapshot.docChanges().forEach((change) =>
    {
      if (change.type === 'added')
      {
        const candidate = new RTCIceCandidate(change.doc.data());
        peerConnection.addIceCandidate(candidate);
      }
    });
  });

  hangupButton.disabled = false;
};

// Answering calls
answerButton.onclick = async () =>
{
  const callId = callInput.value;
  const callDoc = firestore.collection('calls').doc(callId);
  const answerCandidates = callDoc.collection('answerCandidates');
  const offerCandidates = callDoc.collection('offerCandidates');

  peerConnection.onicecandidate = (event) => 
  {
    event.candidate && answerCandidates.add(event.candidate.toJSON());
  };

  const callData = (await callDoc.get()).data();

  const offerDescription = callData.offer;
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answerDescription);

  const answer =
  {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await callDoc.update({ answer });

  offerCandidates.onSnapshot((snapshot) =>
  {
    snapshot.docChanges().forEach((change) =>
    {
      console.log(change);
      if (change.type === 'added')
      {
        let data = change.doc.data();
        peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
  hangupButton.disabled = false;
};

// Hangup functionality
hangupButton.onclick = async () =>
{
  // peerConnection.enabled = false;
  peerConnection.close();
  webcamVideo.srcObject = null;
  remoteVideo.srcObject = null;
}