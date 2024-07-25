// pages/api/task.js
import cron from 'node-cron';
import axios from 'axios';

let taskStarted = false;

export default function handler(req, res) {
  if (req.method === 'POST') {
    if (!taskStarted) {
      // Start the cron job
      cron.schedule('* * * * *', async () => {
        console.log('Running a task every minute');
        
        // Simulate a task, e.g., making an HTTP request
        try {
          const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
          console.log(response.data);
        } catch (error) {
          console.error(error);
        }
      });

      taskStarted = true;
    }

    res.status(200).json({ message: 'Task scheduled' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
