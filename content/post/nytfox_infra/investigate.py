#!/usr/bin/env python

import os

import polars as pl
import matplotlib.pyplot as plt
import json

#%%

nythosts = []
for line in open("./data/nythosts.json", "r"):
    nythosts.append(json.loads(line))

nythosts = list(filter(lambda j: 'http' in j, nythosts))

foxhosts = []
for line in open("./data/foxhosts.json", "r"):
    foxhosts.append(json.loads(line))
foxhosts = list(filter(lambda j: 'http' in j, foxhosts))

nytaddr = list(map(lambda j: j['http']['host'], nythosts))
foxaddr = list(map(lambda j: j['http']['host'], foxhosts))

#%%

def loc_tab(tar, data):
    return map(lambda j: j['location'][tar], data)
fox_loc_tab = {a: loc_tab(a, foxhosts) for a in ["city", "latitude", "longitude"]}
fox_loc_tab["host"] = foxaddr

nyt_loc_tab = {a: loc_tab(a, nythosts) for a in ["city", "latitude", "longitude"]}
nyt_loc_tab["host"] = nytaddr

foxlocs = pl.DataFrame(fox_loc_tab)
nytlocs = pl.DataFrame(nyt_loc_tab)

#%%

print("foxlocs:")
print(foxlocs)

#%%

print("nytlocs:")
print(nytlocs)

