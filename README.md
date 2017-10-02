# WebBCI
- bcivr.com

Legacy BCI2000 stuff in 'Old' folder (just a UDP read and socketio send).


# New issues:

 - Can stream and plot data (socketio+smoothie), but connection cuts out and requires manual reset.
Either method of connection is incorrect, or the system is just being overloaded (possible sample rate/latency issue)

- Fix delay with plotting/overflow of the RT bci data
- Can't seem to set impedence-mode

# Next:

- Incorporate option to choose which data to stream
- Move server-side comms to electron app?
- Option to choose wifi/bluetooth
