# WebRTC Café

WebRTC Café is a bare bones demo of WebRTC built with Node.js, Socket.io, HTML, CSS and JavaScript.

To run the examples just clone the repo, cd into each section, then run the js file with node, or run a simple `http-server` (I'd recommend https://www.npmjs.com/package/http-server). You'll need to serve up your example, you can't run them on `file://...`

WebRTC spec: http://www.w3.org/TR/webrtc

WebRTC talk by Chris Wilson: https://www.youtube.com/watch?v=3Ifbqaw5l_I

## Overview

WebRTC encompasses quite a few major achievements by tech companies and engineers. WebRTC is a term that covers a collection of technologies that when used together enable real-time, peer-to-peer communications native to the web. The implications of which are actually quite incredible.

## Contents

WebRTC has four main tasks:

1. [Acquire Video and Audio](#1-acquiring-video-and-audio)
2. [Establish a connection between peers](#2-establishing-a-connection-between-peers)
  1. [Within a LAN](#)
  2. [Across the Internet](#) 
3. [Send and receive audio and video data](#)
4. [Send and receive arbitrary data](#)

## 1. Acquiring Video and Audio

This one is fun and easy, and you should try it for yourself right now ツ

#### HTML

```html
<video id="myVideo" muted autoplay></video>
```

The reason we're muting here is to avoid feedback (that loud squeaking when a microphone gets close to a speaker).

#### JavaScript

```javascript
navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

navigator.getUserMedia({
  video: true,
  audio: true
}, function (myWebcamStream) {
  var url = window.URL.createObjectURL(myWebcamStream);
  window.stream = myWebcamStream; // Make stream available to the console (optional).
  var myVideo = document.getElementById('myVideo');
  myVideo.src = url;
  myVideo.play();
}, function (error) {
  console.log("navigator.getUserMedia error: ", error);
});
```
So getUserMedia accepts three parameters, the first is a **Constraints Object**, the second is a success handler which gives you a **Stream** and the last is an error handler that gives you an error.

In our example we're asking for audio, but providing the `muted` attribute to the video element so that the audio doesn't play. Feel free to remove it. You should here some echoing and maybe some feedback noise.

_Be aware, sometimes `file://my-attempt.html` will not work, you'll need to serve up your html over http to get this working._ I'd recommend https://www.npmjs.com/package/http-server

**Great, now we've grabbed our own webcam and mic video and audio and displayed them in a video element!**

With only this, you can build a phonebooth application, or a 'take a photo' feature for when users set up a new profile with your website, and a fun bunch of other things.

Check out the spec on _Media Capture and Streams_ for full details on the **Contraints Object** the **Stream** provided by the getUserMedia success handler and more: http://w3c.github.io/mediacapture-main/getusermedia.html

## 2. Establishing a Connection Between Peers

Okay, not let's get to the tricky awesome stuff. Although, WebRTC is peer-to-peer, you still need a way to identify a few things about the peer you're connecting to, like where they are in the network, how to deal with their firewall if they have one, what type of video codec they support and so forth. Servers are used to negotiate all this, and establish a connection between peers. The terms used for this is called **Signaling**. You'll also need a way for your app to know who wants to talk to who...

We'll use a server for this, Node.js + Socket.io in our case.

### Establishing a connection within a Local Area Network

### Adding signalling to get WebRTC working across the Internet

