const express = require('express');
const app = express();
const fs = require('fs');
const ExpressError = require('./expressError');

app.get('/mean', (req, res, next) => {
  try {
    const numbers = req.query.nums.split(',');
    const sum = numbers.reduce((acc, curr) => acc + Number(curr), 0);
    const mean = sum / numbers.length;
    if (isNaN(mean)) throw new ExpressError('nums are required', 404);
    return res.json({ operation: 'mean', result: Number(mean) });
  } catch (err) {
    return next(err);
  }
});

app.get('/median', (req, res, next) => {
  try {
    const numbers = req.query.nums.split(',');
    const median = numbers.sort((a, b) => a - b)[
      Math.floor(numbers.length / 2)
    ];
    if (isNaN(median)) throw new ExpressError('nums are required', 404);
    return res.json({ operation: 'median', result: Number(median) });
  } catch (err) {
    return next(err);
  }
});

app.get('/mode', (req, res, next) => {
  try {
    const numbers = req.query.nums.split(',');
    const mode = numbers.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
    const max = Math.max(...Object.values(mode));
    const result = Object.keys(mode)
      .filter((key) => mode[key] === max)
      .join(',');
    if (isNaN(result)) throw new ExpressError('nums are required', 404);
    return res.json({ operation: 'mode', result: Number(result) });
  } catch (err) {
    return next(err);
  }
});

app.get('/all', (req, res, next) => {
  try {
    const numbers = req.query.nums.split(',');
    const mean =
      numbers.reduce((acc, curr) => acc + Number(curr), 0) / numbers.length;
    const median = numbers.sort((a, b) => a - b)[
      Math.floor(numbers.length / 2)
    ];
    const mode = numbers.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
    const max = Math.max(...Object.values(mode));
    const result = Object.keys(mode)
      .filter((key) => mode[key] === max)
      .join(',');
    if (isNaN(result)) throw new ExpressError('nums are required', 404);
    return res.json({
      operation: 'all',
      result: { mean, median, mode: Number(result) },
    });
  } catch (err) {
    return next(err);
  }
});

app.use(function (req, res, next) {
  const badRequest = new ExpressError('Bad Request', 404);
  return next(badRequest);
});

app.use(function (err, req, res, next) {
  let status = err.status || 500;
  let message = err.message;

  return res.status(status).json({ error: { message, status } });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
