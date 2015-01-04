# WebRTC Café

WebRTC Café is a bare bones demo of WebRTC built with Node.js (for signaling), HTML, CSS and Javascript.

WebRTC spec: http://www.w3.org/TR/webrtc

WebRTC talk by Chris Wilson: https://www.youtube.com/watch?v=3Ifbqaw5l_I

## Overview

WebRTC encompasses quite a few major achievements by tech companies and engineers. WebRTC is a term that covers a collection of technologies that when used together enable real-time, peer-to-peer communications native to the web. The implications of which are actually quite incredible.

## Contents

WebRTC has four main tasks:

1. [Acquire Video and Audio](#one)
2. [Establish a connection between peers](#two)
3. [Send and receive audio and video data](#three)
4. [Send and receive arbitrary data](#four)

## <a name="one"></a>1. Acquiring Video and Audio

This one is fun and easy, and you should try it for yourself right now ツ

#### HTML

```html
<video id="myVideo" muted autoplay></video>
```

The reason we're muting here is to avoid feedback (that loud squeaking when a microphone gets close to a speaker).

#### Javascript

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

**Great, now we've grabbed our own webcam and mic video and audio and displayed them in a video element!

With only this, you can build a phonebooth application, or a 'take a photo' feature for when users set up a new profile with your website, and a fun bunch of other things.

Check out the spec on _Media Capture and Streams_ for full details on the **Contraints Object** the **Stream** provided by the getUserMedia success handler and more: http://w3c.github.io/mediacapture-main/getusermedia.html

