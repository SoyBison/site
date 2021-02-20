---
title: "Computer Vision for Memorability"
date: 2020-10-24T17:04:31-05:00
draft: false
---

## Info

Reimplemementing and testing Aditya Khosla's MemNet[[1]](#1), and beyond.

## Goals

Memnet has been difficult to access since Dr. Khosla's departure from the academic world. We would like to implement it so that we can use his work for our own research. The short term goal is to simply get it working. In the long term we'd like to improve upon the architecture using pre-training, and possibly some other progress in neural network architecture that has been made since 2015. In addition we'd like to get a tool running for in-lab use. This will be implemented in PyTorch.

A decent amount of progress has been made on this project so far. The progress will be chronicled in a number of blog posts.

1. [MemNet and Similar Models]({{<relref "memnetch1">}})
2. [ResMem Release](https://www.coeneedell.com/post/resmemrelease/)
3. [ResMem and M3M]({{<relref "memnetch2">}})

A release version of ResMem, the best performing model I've made so far (at least that isn't too large to run on personal computers) is publicly available! The source code can be found at [github.](https://github.com/Brain-Bridge-Lab/resmem) But there's an easy-to-install version on PyPI, with a web interface coming soon. Just type into your console:

```
pip install resmem
```

## Resources

<a id="1"> 1 </a> :
 Khosla, Aditya, Akhil S. Raju, Antonio Torralba, and Aude Oliva.  2015.“Understanding and Predicting Image Memorability at a Large Scale.”  In2015 Ieee International Conference on Computer Vision (Iccv), 2390–8. IEEE.https://doi.org/10.1109/ICCV.2015.275.1

 <a id="2"> 2 </a> :
 Bordelon, B., Canatar, A., & Pehlevan, C. (2020). Spectrum dependent learning curves in kernel regression and wide neural networks. ArXiv:2002.02561 [Cs, Stat]. http://arxiv.org/abs/2002.02561

 <a id="3"> 3 </a> :
 L. Goetschalckx, A. Andonian, A. Oliva, and P. Isola. GANalyze: Toward Visual Definitions of Cognitive Image Properties. , 2019. http://ganalyze.csail.mit.edu/

 <a id="4"> 4 </a>:
 https://docs.daft-pgm.org/en/latest/
