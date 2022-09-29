<div align="center">
  
# PiRoutine | Server & AlarmClock ⏰💦

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)


###  PiRoutine is a morning alarm system that uses a port forwarded raspberry pi, that's wired via relay switch to a water pump, and interacted with through a deployed front end. 
 ### All of which aims to instill good habits in the user, starting by waking up on time. 

![](https://media.giphy.com/media/u6WXNK5Z5AObZ9eOaa/giphy.gif)
 
###  This is done by leveraging a pavlovian fear of laying in bed too long after they've heard their external alarm go off, by soaking the user and/or their bed with water. In return, the user quickly learns to wake up alongside their external alarm, jumping out of bed, ready to start their day with a light jog!
[Check It Out!](https://piroutine.com)
</div>

---


## Raspberry Pi Installation
  The raspberry pi is connected to a water pump, stored inside the 5 gallon bucket beside the bed. The pump has tubing connecting it to a piece of conduit with holes drilled into it, attached to my headboard. 

<div align="center">

![](https://media.giphy.com/media/BOUoNFCUU2GLJcLk6I/giphy-downsized.gif)

(While this gif is outdated, it gets the point across)
</div>

## Set Up

- Clone to your Raspberry Pi.
- Install MySQL and connect to your Pi's mysql database.
- Port Forward the Pi so it's accessible by external networks. (Cautiously)
- Install PM2 and set it up to run `server` & `alarmclock` on startup.
- Clone, Install & Deploy the PiRoutine Client & [read it's README](https://github.com/daurham/PiRoutine-EC2-Client)

<div align="center">

---

One day, I'll make a video. Meanwhile, just ask if you'd like help setting up.

![](https://media.giphy.com/media/4T9FrMFKvVCOVPt3AD/giphy.gif)

-Jake Ernest Daurham

</div>
