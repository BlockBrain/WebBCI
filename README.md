# WebBCI
- bcivr.com

<<<<<<< HEAD
=======
Legacy BCI2000 stuff in 'Old' folder (just a UDP read and socketio send).
>>>>>>> c1f8a69f3e28c18612c24bbeb4fac56c11c49bdb


# New issues:

 - Can stream and plot data (socketio+smoothie), but connection cuts out and requires manual reset.
Either method of connection is incorrect, or the system is just being overloaded (possible sample rate/latency issue)

- Fix delay with plotting/overflow of the RT bci data
- Can't seem to set impedance-mode

# Next:

- Incorporate option to choose which data to stream
<<<<<<< HEAD
=======
- Move server-side comms to electron app?
>>>>>>> c1f8a69f3e28c18612c24bbeb4fac56c11c49bdb
- Option to choose wifi/bluetooth
- Incorporate multi-user interactions (right now each instance is independent of others)
- Allow user to connect to openBCI via browser (current server-side)
  - Wifi: Add input box for ipAddress/boardName.
  - Bluetooth: Add input box for COM port
