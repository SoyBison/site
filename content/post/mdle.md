---
# Documentation: https://wowchemy.com/docs/managing-content/

title: "A Differential Language Model"
subtitle: ""
summary: "One of the simplest language models is the Maximum Liklihood Estimator. How can we use that paradigm to create models of language which are not just designed to mimic human writers?"
authors: []
tags: ["Machine Learning", "Natural Language", "Statistical Learning", "Scientific Tools"]
categories: []
date: 2022-04-18T17:37:26-04:00
lastmod: 2022-04-18T17:37:26-04:00
featured: false
draft: true

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: false

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---

## Background

The language model is the jewel of Natural Language Processing. No matter who you are, if you've heard of anything in Natural Language Processing, it was a language model.
Most recently, the language model known as GPT-3, made by OpenAI has been infesting the public consciousness, this is largely because OpenAI is fantastic at marketing their models.

Well anyway GPT-3 is consistently outperformed on standard benchmarks by publicly available models like DeBERTa, which is much lighter than GPT-3, and even other large scale models seem to outperform GPT-3. Currently the leader in the SuperGLUE benchmark has the catchy name "ST-MoE-32B". Perhaps we shouldn't believe everything we're told by OpenAI about language models.
Anyway those are the elephants of the language model ecosystem, lets look at the mice.

The famous language models are built to *mimic natural language*. This is a noble goal, and a very computer-science-y approach.
There's a dataset, and a benchmark, and the goal of these models is to get as high of a score on the benchmark as possible.
My work is usually more focused on how we can use machine learning and computer science to better understand something.


