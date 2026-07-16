---
title: 3D-printing spatially varying BRDFs
date: 2013-09-23
venue: IEEE computer graphics and applications
doi: 10.1000/example
order: 1
permalink: brdf
---
I did 2 years as a PhD Student at TU Berlin, and I worked on this project, which was published in Computer Graphics and Applications.


## Workflow diagram

```mermaid
flowchart LR
  RawData[Raw data] --> Clean[Cleaning]
  Clean --> Explore[Exploration]
  Explore --> Model[Modeling]
  Model --> Report[Report]
```

## Sample plot

```plotly
{
  "data": [{
    "x": [1, 2, 3, 4],
    "y": [10, 15, 13, 17],
    "type": "scatter",
    "mode": "lines+markers",
    "name": "Enrollment"
  }],
  "layout": {
    "title": "Weekly enrollment",
    "xaxis": { "title": "Week" },
    "yaxis": { "title": "Students" }
  }
}
```
