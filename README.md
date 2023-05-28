
# Project for Design of Internet Services (CS 553)
Harry Potter themed P2P video chat application via WebRTC

Video demonstration/tutorial: https://drive.google.com/file/d/1RE8EfLWm8k0lnYlutNRpkmVvNICdPchs/view?usp=sharing


## Introduction

Thank you for going through this final course project for CS553 - Design of Internet Services.
This readme file incorporates all the steps necessary to set up the application and get it up and running.

## Authors

- [@dhanur-sharma](https://github.com/dhanur-sharma)
- [@Spriy4nshu](https://github.com/Spriy4nshu)


## Requirements
Please ensure that the following dependencies are installed before proceeding with the installation:
- MacOS 13.3
- git (git version 2.39.1)
- node (v20.0.0)
- npm (9.6.4)
- A web browser:
    - Google Chrome (tested on Version 113.0.5672.64)
    - Brave (tested on Version 1.50.121 Chromium: 112.0.5615.138 (Official Build) (arm64))

Stressing that the application has so far only been tested on a system resembling the above, hence the application should be installed on MacOS 13.3 specifically with the above browsers and after the following steps having been followed:

## Installation
### Step 1: Clone the repository
After navigating to the directory you'd like to install the application in, run the following command to clone the repository:

```bash
git clone https://github.com/dhanur-sharma/cs553_project.git
```

This will download the code for the application.

### Step 2: Install the application
In order to install the application, navigate to the *cs553_project* directory that has been cloned and run the following commands on the terminal:

```bash
cd cs553_project
npm install
npm run dev
```

### Step 3: Setup the call
Once the webpage is hosted, you should see something that resembles the following output:
```bash
  > Local:    http://localhost:3019/
  > Network:  http://10.2.10.192:3019/
```

- Host device:
Navigate to the first link on the system that has the application installed. You'll be able to see the Harry Potter themed interface. (You should not be up to any good!)

Click on the "Start the magical devices that see and hear you!" button and grant permissions to the webpage to access your camera and microphone.

You should be able to see what your webcam sees and are now ready to use the application on this device.


- Remote device:
While accessing the application through the network on another device, there is an additional step that need to be taken to circumvent the security protocols that web browsers have in place.
We're listing down the specific steps for Google Chrome/ Brave, but this can be repeated on any browser by following the browser specific commands.

In the interest of time and scope of this project, we are limiting the use of this application on Google Chrome/ Brave and have thus tested it on the same.

This step ensures that the webpage loaded from the network is trusted and secure as far as the browser is concerned, that then allows the use of webcam and microphone.

Open a new tab on the browser and paste the following in the address bar:

- Google Chrome:
```bash
chrome://flags/#unsafely-treat-insecure-origin-as-secure
```

- Brave:
```bash
brave://flags/#unsafely-treat-insecure-origin-as-secure
```

Add the network link in the text area and enable the option. The browser will prompt a restart for the changes to take effect, please do the same.

Once the browser has restarted, you can navigate to the link and follow the same step to turn on the camera and microphone on the application.

### Step 4: Set up the call
In order to set up the call, there needs to be an offer of the call created, which is basically a call offer document that is stored in firebase that contains the SDP (Session Description Protocol) that is facilitated by the ICE (Interactivity Connectivity Estabilishment) candidates.

One peer needs to generate the UID for the call by clicking the *Accio Secret Code!* button.
This UID generated and pasted in the textbox under it is to be sent to the other peer to be added to the textbox beside the *Connect!* button. Once that is pasted/typed in, clicking the connect button will start the call between the peers.

### Step 5: Hangup
Clicking the *Michief Managed!* button ends the connection and the call.

### Gathering metrics
We use the WebRTC-Internal API to collect and analyze the metrics over the call to come to the inferences that we have in the report after having compared the following different environments of networks:

- Uncongested Mobile Hotspot
- Residential (Apartment) Network
- Rutgers campus network (Busch campus)
- Rutgers inter-campus network (College Ave to Busch campus)

In order to source these metrics once the call is in progress, paste the following in the address bar of the same browser in order to view the metrics being gathered:

- Chrome:
```
chrome://webrtc-internals/
```

- Brave:
```
brave://webrtc-internals/
```

## Features

- Calls themselves do not use internet
- Cross platform/device calls
- A magical call experience

### Work in Progress Note:
The buttons to toggle the video and audio on/off is a feature that is still a work in progress and should not be trusted with this current release.

**The only way to actually disconnect is to use the "Michief Managed!" hangup button, then close the browser tab.**
## References

 - [Vite](https://vitejs.dev/guide/why.html)
 - [Node](https://nodejs.org/en/docs)
 - [WebRTC](https://codelabs.developers.google.com/codelabs/webrtc-web#0)
 - [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
 - [WebRTC Internal](https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API)
 - [WebRTC Internal API](https://testrtc.com/webrtc-internals-documentation/)
 - [Firebase](https://firebase.google.com/docs)

## Acknowledgements
We'd like to thank Professor Srinivas Narayana for his continued support and guidance to facilitate building this application.
Took a long time to zone in on an idea so we'd like to thank him for his extended patience with us as well!