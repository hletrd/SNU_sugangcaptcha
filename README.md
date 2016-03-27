# SNU sugang captcha bot
* CNN + relu
* Based on node.js + ConvNetJS(Convolutional neural network for Javascript)

## How to train neural network
* Put sample image in 'train' directory, and rename as
```
(Answer)_(anything chars(to avoid duplication)).png
```
* Run below
```bash
$ node train.js
```

## How to read a captcha
* Put captcha image in 'read' directory
* Run below
```bash
$ node read.js
```
* File will be moved to the directory named 'result', and will be renamed as
```
(Result(digits))_(Probability(1st digit))_(Probability(2nd digit))_(Random number).png
```
* File will be moved to the directory named 'failed' if it can't be read.
