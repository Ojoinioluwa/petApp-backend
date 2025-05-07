require("dotenv").config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const scheduleReminders = require("./jobs/sendReminder");
const userRouter = require("./services/User/userService");
const petRouter = require("./services/Pet/petService");
const healthRouter = require("./services/HealthRecord/helathRecordServices");
const reminderRouter = require("./services/Reminder/reminderService");
const errorHandler = require("./middlewares/errorHandler");

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

// 404 handler (for any route not matched above)
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);

scheduleReminders();


