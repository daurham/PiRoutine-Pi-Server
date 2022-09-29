# PiRoutine | Server & Alarmclock ⏰💦🏃‍♂️
PiRoutine is a morning alarm system that uses a port forwarded raspberry pi, wired via relay switch to a water pump and interacted with, through a deployed front end. All of which aims to instill good habits in the user by waking up on time. This is done by leveraging a pavlovian fear of laying in bed too long after they've heard their external alarm go off, by soaking the user and/or their bed with water. In return, the user quickly learns to wake up alongside their external alarm, jumping out of bed, ready to start their day!

---


## Raspberry Pi Installation
The raspberry pi is connected to a water pump in the 5 gallon bucket, and some tubing is feeding it to a piece of conduit with holes drilled into, attached to my headboard. 
- (While this gif is outdated, it gets the point across)

![](https://media.giphy.com/media/BOUoNFCUU2GLJcLk6I/giphy-downsized.gif)

- Clone to your Raspberry Pi
- Connect to your Pi's mysql database
- Port Forward the Pi so it's accessible externally
- Install / set up pm2 to run `server` & `alarmclock` on startup
- Clone, Install & Deploy the PiRoutine Client & [read it's README](https://github.com/daurham/PiRoutine-EC2-Client/edit/main/README.md)

One day, I'll make a video. Meanwhile, just ask if you'd like help setting up.

-Jake Ernest Daurham
