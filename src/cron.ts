const cron = async () => {
  const query = fetch('https://project-midnight-backend.onrender.com/test');

  query
    .then(res => res.json())
    .catch(err => console.log(err));
};

cron();
