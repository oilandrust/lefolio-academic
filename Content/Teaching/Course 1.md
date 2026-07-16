---
title: "Introduction to Data Science"
date: 2025-09-01
order: 1
permalink: course-1
---

This course introduces Python, statistics, and visualization for graduate students.

## Topics

1. Data wrangling with pandas
2. Visualization
3. Basic machine learning

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
