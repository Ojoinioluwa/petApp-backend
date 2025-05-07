require("dotenv").config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const scheduleReminders = require("./controllers/sendReminder");
const userRouter = require("./services/User/userService");
const petRouter = require("./services/Pet/petService");
const healthRouter = require("./services/HealthRecord/helathRecordServices");
const reminderRouter = require("./services/Reminder/reminderService");

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=> console.log('MongoDB is connected'))
.catch(err => console.log(err));

// middlewares
app.use(express.json());
app.use(cors());
// app.use(express.urlencoded({ extended: true }));

// consume the routes here
app.use("/", userRouter);
app.use("/", petRouter);
app.use("/", healthRouter);
app.use("/", reminderRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);

scheduleReminders();


