# WebBCI


Projects a total mess. Original plan was to have home automation, energy usage, bci use, etc etc be combined into a single project, but that was stupid.
Going to try and partition it as best as possible.
Removing BCI2000 stuff since I plan to stick with the openBCI as the primary signal acquisition platform.
BCI2000 stuff was essentially just a UDP read and socketio send.


# New issues:

 - Can stream and plot data (socketio+smoothie), but connection cuts out and requires manual reset.
Either method of connection is incorrect, or the system is just being overloaded (possible sample rate/latency issue)

- Fix delay with plotting/overflow of the RT bci data

# Next:

- Incorporate option to choose which data to stream
- Move server-side comms to electron app?
- Option to choose wifi/bluetooth
